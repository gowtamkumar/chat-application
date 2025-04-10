/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CouponType, DiscountType } from '@enums/common.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CouponProductEntity } from './coupon-product.entity';

@Entity('coupons')
export class CouponEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CouponType })
  type: CouponType;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'discount_type', type: 'enum', enum: DiscountType })
  discountType: DiscountType;

  @Column()
  value: number;

  @Column({
    name: 'start_date',
    type: 'timestamptz',
    nullable: true,
  })
  startDate: string;

  @Column({
    name: 'expiry_date',
    type: 'timestamptz',
    nullable: true,
  })
  expiryDate: string;

  @Column({ name: 'min_order_amount', type: 'numeric', nullable: true })
  minOrderAmount: number;

  @Column({ name: 'min_cart_value', type: 'numeric', nullable: true })
  mincartValue: number;

  @Column({ name: 'max_user', nullable: true })
  maxUser: number;

  @Column({ name: 'max_discount_value', nullable: true })
  maxDiscountValue: number;

  @Column({ name: 'usage_count', nullable: true })
  usageCount: number;

  @Column({ name: 'usage_limit', nullable: true })
  usageLimit: number;

  @Column({ name: 'usage_per_user', nullable: true })
  usagePerUser: number;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @Column({ name: 'user_id' })
  userId?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;

  @OneToMany((_type) => CouponProductEntity, (items) => items.coupon)
  products: CouponProductEntity[];
}
