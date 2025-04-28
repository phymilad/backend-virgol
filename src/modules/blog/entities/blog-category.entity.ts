import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Entity } from "typeorm";

@Entity(EntityNames.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {}