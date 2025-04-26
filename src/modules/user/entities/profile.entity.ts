import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.Profile)
export class ProfileEntity extends BaseEntity {
    @Column({nullable: true})
    nick_name: string
    
    @Column({nullable: true})
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

    // Relation with UserEntity
    @Column({nullable: true})
    userId: number
    @OneToOne(() => UserEntity, (user) => user.profile, {onDelete: "CASCADE"})
    @JoinColumn()
    user: UserEntity
}