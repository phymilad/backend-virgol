import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enums/status.enum";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    content: string;
    @Column()
    image: string;
    @Column({default: BlogStatus.DRAFT})
    status: BlogStatus;
    @Column()
    authorId: number;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
