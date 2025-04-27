import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity(EntityNames.BlogLike)
export class BlogLikeEntity extends BaseEntity {
    @Column()
    blogId: number;

    // Relation with UserEntity
    @Column()
    userId: number;
    @ManyToOne(() => UserEntity, (user) => user.blog_likes, {onDelete: 'CASCADE'})
    user: UserEntity

}