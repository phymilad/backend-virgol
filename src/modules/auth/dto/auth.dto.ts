import { IsEnum, IsString, Length } from "class-validator"
import { AuthType } from "../enums/type.enum"
import { AuthMethod } from "../enums/method.enum"

export class AuthDto {
    @IsString()
    @Length(3,100)
    username: string
    @IsEnum(AuthType)
    type: AuthType
    @IsEnum(AuthMethod)
    method: AuthMethod
}

export class CheckOtpDto {
    @IsString()
    @Length(5,5)
    code: string
}