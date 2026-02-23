import { authSchema } from "~~/utils/validations";

export default defineEventHandler(async(event) => {
    const {name , email , password} = await readValidatedBody(event , (body)=>authSchema.parse(body));
    // find the user from DB
    const existingUser = await db.user.findUnique({
        where:{
            email
        }
    })
    if(existingUser){
        throw createError({
            statusCode:400,
            statusMessage:'User already exists'
        })
    }
    // hash the password
    const hashedPassword = await hashPassword(password)
    // create the user
    const user = await db.user.create({
        data:{
            email,
            name,
            hashedPassword
        }
    })
    // sanitize the user
    const transformedUser = sanitizeUser(user);
    if(transformedUser) {
      await setUserSession(event, {
        user: transformedUser,
      });
    }
    return transformedUser;
    
})