import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @Length(10, 150)
    title: string
    
    @IsString()
    @IsOptional()
    slug: string

    @IsString()
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
    image: string

}