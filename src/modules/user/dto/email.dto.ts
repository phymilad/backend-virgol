import { IsEmail } from "class-validator";

export class ChangeEmailDto {
    @IsEmail({}, { message: "Invalid email format" })
    email: string
}