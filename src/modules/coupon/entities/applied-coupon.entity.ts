/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserEntity } from '@admin/user/entities/user.entity';
import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('applied_coupons')
export class AppliedCouponEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'coupon_id' })
  couponId: string;

  @Column({ name: 'order_id' })
  orderId: string;
  // @ManyToOne((_type) => OrderEntity, (item) => item.appliedCouponItems, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "order_id" })
  // order: OrderEntity;

  @Column({
    name: 'discount_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  discountAmount: string;

  @Column({ name: 'user_id' })
  userId: string;
  // @ManyToOne((_type) => UserEntity, (user) => user.reviews)
  // @JoinColumn({ name: 'user_id' })
  // user: UserEntity;

  @CreateDateColumn({ name: 'applied_at', type: 'timestamp' })
  appliedAt?: string;
}
