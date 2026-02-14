import { type User } from "../../app/generated/prisma";

export const sanitizeUser = (user: User) => {
    if(!user) return null;
    // @ts-ignore
    delete user.hashedPassword;
    return user;
}