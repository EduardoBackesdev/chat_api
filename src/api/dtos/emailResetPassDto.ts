import { IsEmail, IsString } from "class-validator";

export class emailResetPassDto{
    @IsEmail()
    email: string
}