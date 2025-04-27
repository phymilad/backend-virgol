import { IsString, Length } from "class-validator";

export class ChangeUsernameDto {
    @IsString()
    @Length(3,100)
    username: string
}