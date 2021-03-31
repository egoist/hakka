import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { User } from './user.entity'
import { Comment } from './comment.entity'
import { UserTopicLike } from './user-topic-like.entity'

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Index()
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @Index()
  updatedAt: Date

  @Column()
  title: string

  @Column()
  content: string

  @Column({ nullable: true })
  url?: string

  @ManyToOne((type) => User, (user) => user.topics)
  author: User

  @Column()
  @Index()
  authorId: number

  @OneToMany((type) => Comment, (comment) => comment.topic)
  comments: Comment[]

  @OneToMany((type) => UserTopicLike, (u) => u.topic)
  userTopicLikes: UserTopicLike[]

  @Column({ nullable: true })
  lastCommentId?: number

  @OneToOne((type) => Comment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  lastComment?: Comment

  /**
   * Hide the topic from being listed (but still exists and visible)
   */
  @Column({ nullable: true })
  hidden?: boolean
}
