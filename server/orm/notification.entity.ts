import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @ManyToOne((type) => User, (user) => user.notifications)
  user: User

  @Column()
  userId: number

  @Column({ nullable: true })
  isRead?: boolean

  @Column({
    type: 'jsonb',
  })
  data: any
}
