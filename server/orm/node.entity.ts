import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Topic } from './topic.entity'

@Entity()
export class Node {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  @Column({ unique: true })
  slug: string

  @Column()
  name: string

  @Column()
  description: string

  @Column({ nullable: true })
  image?: string

  @OneToMany((type) => Topic, (topic) => topic.node)
  topics: Topic[]
}
