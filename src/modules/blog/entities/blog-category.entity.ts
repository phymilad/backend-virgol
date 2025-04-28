import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityNames.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {
    // Relation with BlogEntity
    @Column()
    blogId: number;
    @ManyToOne(() => BlogEntity, (blog) => blog.categories, {onDelete: 'CASCADE'})
    blog: BlogEntity
}