import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Comment } from './comment.entity'
import { User } from './user.entity'

@Entity()
export class UserCommentLike {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @Column()
  @Index()
  userId: number

  @ManyToOne((type) => User, (user) => user.userCommentLikes)
  user: User

  @Column()
  @Index()
  commentId: number

  @ManyToOne((type) => Comment, (comment) => comment.userCommentLikes)
  comment: Comment
}
