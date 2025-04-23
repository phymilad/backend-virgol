import { IsDate, IsEnum, IsOptional, IsString, Length, MaxLength } from "class-validator"
import { Gender } from "../enum/gender.enum"

export class ProfileDto {
    @IsString()
    @Length(3, 50)
    @IsOptional()
    nick_name: string
    @IsString()
    @Length(10, 200)
    @IsOptional()
    bio: string
    @IsString()
    @IsOptional()
    image_profile: string
    @IsString()
    @IsOptional()
    bg_image: string
    @IsOptional()
    @IsEnum(Gender)
    gender: Gender
    @IsDate()
    @IsOptional()
    birthdate: Date
    @IsString()
    @IsOptional()
    x_profile: string
    @IsString()
    @IsOptional()
    linkedin_profile: string
}