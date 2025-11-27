import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: 'OPEN' }) // OPEN, IN_PROGRESS, CLOSED
  status: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: false })
  isUrgent: boolean;

  @Column({ default: 0 })
  priorityScore: number; // 1~5

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.tickets)
  user: User;
}