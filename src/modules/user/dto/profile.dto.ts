import { ApiPropertyOptional } from "@nestjs/swagger"
import { Length, MaxLength } from "class-validator"
import { Gender } from "../enum/gender.enum"

export class ProfileDto {
    @ApiPropertyOptional()
    @Length(3, 50)
    nick_name: string
    @ApiPropertyOptional()
    @Length(10, 200)
    bio: string
    @ApiPropertyOptional({nullable: true, format: "binary"})
    image_profile: string
    @ApiPropertyOptional({nullable: true, format: "binary"})
    bg_image: string
    @ApiPropertyOptional({nullable: true, enum: Gender})
    gender: string
    @ApiPropertyOptional({nullable: true, example: "1992-03-04T11:44:28.332Z"})
    birthdate: Date
    @ApiPropertyOptional({nullable: true})
    x_profile: string
    @ApiPropertyOptional({nullable: true})
    linkedin_profile: string
}