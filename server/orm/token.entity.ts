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
export class Token {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @Column({ type: 'timestamp with time zone' })
  lastActiveAt: Date

  @Column()
  type: string

  @Column({ unique: true })
  value: string

  @Column()
  maxAge: string

  @ManyToOne((type) => User, (user) => user.tokens)
  user: User

  @Column()
  @Index()
  userId: number
}
