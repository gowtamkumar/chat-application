/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CouponEntity } from './coupon.entity';

@Entity('coupon_products')
export class CouponProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;
  // @ManyToOne((_type) => ProductEntity, (product) => product.couponProducts, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'product_id' })
  // product: ProductEntity;

  @Column({ name: 'coupon_id' })
  couponId: string;
  @ManyToOne((_type) => CouponEntity, (coupon) => coupon.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon: CouponEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: string;
}
