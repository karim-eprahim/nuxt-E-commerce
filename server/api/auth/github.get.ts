import { sanitizeUser } from "~~/server/utils/auth";
import { db } from "../../utils/db";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    if (!user.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "GitHub account must have a public email",
      });
    }
    let currentUser = await db.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!currentUser) {
      currentUser = await db.user.create({
        data: {
          email: user.email,
          name: user.name || user.login,
          avatarUrl: user.avatar_url,
        },
      });
    }
    const oAuthAccount = await db.oauthAccount.findFirst({
      where: {
        userId: currentUser.id,
      },
    });
    if (!oAuthAccount) {
      await db.oauthAccount.create({
        data: {
          userId: currentUser.id,
          providerId: "github",
          providerUserId: user.id + '',
        },
      });
    }
    console.log(currentUser)
    const transformedUser = sanitizeUser(currentUser);
    if(transformedUser) {
      await setUserSession(event, {
        user: transformedUser,
      });
    }
    return sendRedirect(event, "/");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
