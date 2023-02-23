import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ENewsLetterCategory } from '../../common/enums/newsLetterCategory';

@Entity('eb_subscribe_settings')
export class SubscribeSetting {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({
    type: 'enum',
    name: 'news_letter_category',
    enum: ENewsLetterCategory,
  })
  newsLetterCategory: ENewsLetterCategory;
}
