import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MailToken {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    id_user: number

    @Column()
    token: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    expiration: Date

}