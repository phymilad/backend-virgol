import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @Length(10, 150)
    title: string
    
    @IsString()
    @IsOptional()
    slug: string

    @IsNumberString()
    @IsNotEmpty()
    time_for_study: string

    @IsString()
    @IsNotEmpty()
    @Length(10, 300)
    description: string

    @IsString()
    @IsNotEmpty()
    @Length(100)
    content: string

    @IsString()
    @IsOptional()
    image: string

}