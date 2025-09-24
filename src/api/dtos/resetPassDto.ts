import { IsString } from "class-validator"

export class ResetPassDto{
    @IsString()
    token: string

    @IsString()
    actualPass: string

    @IsString()
    newPass: string
}