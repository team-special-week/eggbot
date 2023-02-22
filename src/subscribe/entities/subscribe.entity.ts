import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscribeSetting } from './subscribe-setting.entity';

@Entity('eb_subscribes')
export class Subscribe {
  @PrimaryGeneratedColumn()
  _id: number;

  @OneToOne(() => SubscribeSetting, { onDelete: 'CASCADE' })
  @JoinColumn()
  setting: SubscribeSetting;

  @Index('uq_channel_id', { unique: true })
  @Column({
    name: 'channel_id',
    type: 'varchar',
    nullable: false,
  })
  channelId: string;

  @Column({
    name: 'subscriber_name',
    type: 'varchar',
    nullable: false,
  })
  subscriberName: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
