import { authSchema } from "~/utils/validations";

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, (body) =>
    authSchema.parse(body),
  );
  // find the user from DB
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }
  // check if the user has a password
  if (!existingUser.hashedPassword) {
    const connectedOuthAccount = await db.oauthAccount.findFirst({
      where: {
        userId: existingUser.id,
      },
    });
    if (connectedOuthAccount) {
      const oAuthProvider = connectedOuthAccount.providerId;
      throw createError({
        statusCode: 400,
        statusMessage: `Account connected with ${oAuthProvider}. please continue with ${oAuthProvider}`,
      });
    }
  }
  // verify the password
  if (existingUser.hashedPassword) {
    const isPasswordCorrect = await verifyPassword(
      existingUser.hashedPassword,
      password,
    );
    if (!isPasswordCorrect) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid Credentials",
      });
    } else {
      // create session
      const transformedUser = sanitizeUser(existingUser);
      if (transformedUser) {
        await setUserSession(event, {
          user: transformedUser,
        });
      }

      return transformedUser;
    }
  }
});
