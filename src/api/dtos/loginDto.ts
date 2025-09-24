import { IsEmail, IsString } from "class-validator";

export class loginUserDto{
    @IsEmail()
    email: string
    
    @IsString()
    password: string
}