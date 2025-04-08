import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString, Length } from "class-validator"
import { AuthType } from "../enums/type.enum"
import { AuthMethod } from "../enums/method.enum"

export class AuthDto {
    @ApiProperty()
    @IsString()
    @Length(3,100)
    username: string
    @ApiProperty()
    @IsEnum(AuthType)
    type: AuthType
    @ApiProperty()
    @IsEnum(AuthMethod)
    method: AuthMethod
}