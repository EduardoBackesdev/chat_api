import { IsEmail, IsString } from "class-validator";

export class resetPassDto{
    @IsEmail()
    email: string
}