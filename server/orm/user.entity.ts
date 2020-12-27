import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Comment } from './comment.entity'
import { Notification } from './notification.entity'
import { Token } from './token.entity'
import { Topic } from './topic.entity'
import { UserCommentLike } from './user-comment-like.entity'
import { UserTopicLike } from './user-topic-like.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  @Column({ unique: true })
  username: string

  @Column({ unique: true, nullable: true })
  email?: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ nullable: true })
  bio?: string

  @Column({ nullable: true })
  github?: string

  @Column({ nullable: true })
  twitter?: string

  @Column({ nullable: true })
  website?: string

  @Column({ unique: true, nullable: true })
  githubUserId?: string

  @Column({ unique: true, nullable: true })
  googleUserId?: string

  @OneToMany((type) => Topic, (topic) => topic.author)
  topics: Topic[]

  @OneToMany((type) => Comment, (comment) => comment.author)
  comments: Comment[]

  @OneToMany((type) => Token, (token) => token.user)
  tokens: Token[]

  @OneToMany((type) => UserTopicLike, (u) => u.user)
  userTopicLikes: UserTopicLike[]

  @OneToMany((type) => UserCommentLike, (u) => u.user)
  userCommentLikes: UserCommentLike[]

  @OneToMany((type) => Notification, (notification) => notification.user)
  notifications: Notification[]
}
