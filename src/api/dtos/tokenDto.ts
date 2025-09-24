import { IsDate, IsNumber, IsString } from "class-validator";

export class TokenDto {
    
    @IsNumber()
    id_user: number

    @IsString()
    token: string

    @IsDate()
    expiration: Date


}