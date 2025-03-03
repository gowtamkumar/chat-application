import { StatusEnum } from '@admin/user/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('brands')
export class BrandEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.Active,
  })
  status: StatusEnum;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;

  // @OneToMany((_type) => ProductEntity, (product) => product.brand)
  // products: ProductEntity[];
}
