import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let { priority, title } = createCategoryDto
    title = await this.checkExistByTitle(title)
    const category = this.categoryRepository.create({title, priority})
    await this.categoryRepository.save(category)
    return {
      message: PublicMessage.Created
    }
  }

  
  findAll(paginationDto: PaginationDto) {
    console.log("paginationDto: ", paginationDto.limit, paginationDto.page)
    return this.categoryRepository.findBy({})
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async checkExistByTitle(title: string) {
    title = title?.trim()?.toLocaleLowerCase()
    const category = await this.categoryRepository.findOneBy({title})
    if(category) throw new ConflictException(ConflictMessage.CategoryTitle)
    return title
  }
}
