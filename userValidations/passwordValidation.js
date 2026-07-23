const z = require('zod');

const PasswordSchema = z.string()
                        .min(10,"Password must have at least 10 Characters")
                        .max(64,"Password cannot be greater than 64 Characters")
                        .regex(/[A-Z]/,"Password must have at least one Uppercase letter")
                        .regex(/[a-z]/,"Password must have at least one Lowercase letter")
                        .regex(/[0-9]/,"Password must have at least one Number")
                        .regex(/[^A-Za-z0-9]/,"Password must have at least one special Character");


module.exports = {PasswordSchema};