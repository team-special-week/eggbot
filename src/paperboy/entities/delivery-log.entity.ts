import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NewsLetter } from '../../newsletter/entities/newsletter.entity';

@Entity('eb_delivery_logs')
export class DeliveryLog {
  @PrimaryGeneratedColumn()
  _id: number;

  @Index('channel_id')
  @Column({
    name: 'channel_id',
    type: 'varchar',
    nullable: false,
  })
  channelId: string;

  @ManyToOne(() => NewsLetter, (newsLetter) => newsLetter.deliveryLogs)
  newsLetter: NewsLetter;

  @CreateDateColumn({
    name: 'delivered_at',
  })
  deliveredAt: Date;
}
