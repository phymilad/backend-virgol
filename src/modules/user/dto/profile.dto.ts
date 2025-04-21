import { Length, MaxLength } from "class-validator"
import { Gender } from "../enum/gender.enum"

export class ProfileDto {
    @Length(3, 50)
    nick_name: string
    @Length(10, 200)
    bio: string
    image_profile: string
    bg_image: string
    gender: string
    birthdate: Date
    x_profile: string
    linkedin_profile: string
}