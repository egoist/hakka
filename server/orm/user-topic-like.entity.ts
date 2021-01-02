import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Topic } from './topic.entity'
import { User } from './user.entity'

@Entity()
export class UserTopicLike {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @Column()
  @Index()
  userId: number

  @ManyToOne((type) => User, (user) => user.userTopicLikes)
  user: User

  @Column()
  @Index()
  topicId: number

  @ManyToOne((type) => Topic, (topic) => topic.userTopicLikes)
  topic: Topic
}
