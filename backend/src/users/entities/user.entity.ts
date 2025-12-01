import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum UserRole {
    ADMIN = 'ADMIN',
    OPERATOR = "OPERATOR",
    CUSTOMER = "CUSTOMER",
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    // 連続失敗回数
    @Column({ default:0 })
    failedAttempts: number;

    // ロック解除日時
    @Column({ type: 'timestamp', nullable: true })
    lockedUntil: Date  | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[];
}