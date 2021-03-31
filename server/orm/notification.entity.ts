import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Index()
  createdAt: Date

  @ManyToOne((type) => User, (user) => user.notifications)
  user: User

  @Column()
  @Index()
  userId: number

  @Column({ nullable: true })
  isRead?: boolean

  @Column({
    type: 'jsonb',
  })
  data: any
}
