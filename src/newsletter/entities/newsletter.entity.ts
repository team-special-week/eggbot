import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';
import { DeliveryLog } from '../../paperboy/entities/delivery-log.entity';

@Entity('eb_newsletters')
export class NewsLetter {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    name: 'title',
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
  })
  content: string;

  @Column({
    name: 'thumbnail_image_url',
    type: 'text',
    nullable: false,
  })
  thumbnailImageUrl: string;

  @Column({
    name: 'redirect_url',
    type: 'text',
    nullable: false,
  })
  redirectUrl: string;

  @Column({
    name: 'written_at',
    type: 'datetime',
    nullable: false,
  })
  writtenAt: Date;

  @Column({
    name: 'delivery_expired_at',
    type: 'datetime',
    nullable: false,
  })
  deliveryExpiredAt: Date;

  @Column({
    type: 'enum',
    name: 'category',
    enum: ENewsLetterCategory,
  })
  category: ENewsLetterCategory;

  @Column({
    name: 'origin_site_url',
    type: 'varchar',
    nullable: false,
  })
  originSiteUrl: string;

  @OneToMany(() => DeliveryLog, (deliveryLog) => deliveryLog.newsLetter)
  deliveryLogs: DeliveryLog[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
