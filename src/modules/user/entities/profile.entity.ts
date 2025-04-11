import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntityNames.Profile)
export class ProfileEntity extends BaseEntity {
    @Column()
    nick_name: string
    @Column()
    bio: string
    @Column({nullable: true})
    image_profile: string
    @Column({nullable: true})
    bg_image: string
    @Column({nullable: true})
    gender: string
    @Column({nullable: true})
    birthdate: Date
    @Column({nullable: true})
    x_profile: string
    @Column({nullable: true})
    linkedin_profile: string
}