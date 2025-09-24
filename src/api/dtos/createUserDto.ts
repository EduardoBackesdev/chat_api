import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class createUserDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(7)
    password: string
}