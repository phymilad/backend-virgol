import { IsNumber, IsString } from "class-validator"

export class CreateCategoryDto {
    @IsString()
    title: string
    @IsNumber()
    priority: number
}
