import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BannerType } from '../enums';

@Entity('banners')
export class BannerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: BannerType, default: BannerType.Slider })
  type: BannerType;

  @Column()
  image: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'user_id' })
  userId: string;
}
