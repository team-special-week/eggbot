import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';
import { Subscribe } from './subscribe.entity';

@Entity('eb_subscribe_settings')
export class SubscribeSetting {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    type: 'enum',
    name: 'news_letter_category',
    enum: ENewsLetterCategory,
  })
  newLetterCategory: ENewsLetterCategory;
}
