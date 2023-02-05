import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eb_subscribe_settings')
export class SubscribeSetting {
  @PrimaryGeneratedColumn()
  _id: number;
}
