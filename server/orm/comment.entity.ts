import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Topic } from './topic.entity'
import { User } from './user.entity'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  @Column()
  content: string

  @ManyToOne((type) => Topic, (topic) => topic.comments)
  topic: Topic

  @Column()
  topicId: number

  @ManyToOne((type) => User, (user) => user.comments)
  author: User

  @Column()
  authorId: number

  @ManyToOne((type) => Comment, (comment) => comment.children, {
    nullable: true,
  })
  parent?: Comment

  @Column({ nullable: true })
  parentId?: number

  @OneToMany((type) => Comment, (comment) => comment.parent)
  children: Comment[]
}
