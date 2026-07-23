const z = require("zod");
const {PasswordSchema} = require('../userValidations/passwordValidation');



const UserZodSchema = z.object({

    FirstName:z.string().max(15),
    LastName:z.string().max(15),
    gender:z.enum(["Male","Female","Others"]).optional(),
    EmailId:z.string().email(),
    password:PasswordSchema,
    UserPhoto:z.string().optional(),
    refreshToken:z.string().optional()
})

module.exports = {UserZodSchema};

