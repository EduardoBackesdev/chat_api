import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Accounts {
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: 1})
    status: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string


}