import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GenderEnum, StatusEnum, RoleEnum, UserTypeEnum } from '../enums';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserTypeEnum, default: UserTypeEnum.Customer })
  type: UserTypeEnum;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum;

  @Column({ nullable: true })
  point: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.User })
  roles: RoleEnum[];

  // @Column({ name: "is_admin", type: "boolean", default: false })
  // isAdmin: boolean;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.Active })
  status: StatusEnum;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: string;

  @Column({ name: 'last_logout', type: 'timestamp', nullable: true })
  lastLogout: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'divice_id', nullable: true })
  diviceId: string;

  @Column({ name: 'reset_token', nullable: true })
  resetToken: string;

  // @Column({ name: "reset_token_expire", type: "bigint", nullable: true })
  // resetTokenExpire: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: string;

  // Relation
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: string;

  // @OneToMany((_type) => ProductEntity, (product) => product.user)
  // products: ProductEntity[];

  // @OneToMany((_type) => OrderEntity, (product) => product.user)
  // orders: OrderEntity[];

  // @OneToMany((_type) => OrderEntity, (order) => order.deliveryMan)
  // orderDeliveries: OrderEntity[];

  // @OneToMany((_type) => ShippingAddressEntity, (shipping) => shipping.user)
  // shippingAddress: ShippingAddressEntity[];

  // @OneToMany((_type) => ReviewEntity, (review) => review.user)
  // reviews: ReviewEntity[];

  // @OneToMany((_type) => WishListEntity, (wishlist) => wishlist.user)
  // wishlists: WishListEntity[];

  // @OneToMany((_type) => PaymentEntity, (payment) => payment.user)
  // payments: PaymentEntity[];

  // @OneToMany((_type) => UserActivityEntity, (userActivity) => userActivity.user)
  // userActivities: UserActivityEntity[];

  // @OneToMany((_type) => PostEntity, (post) => post.user)
  // posts: PostEntity[];

  // @OneToMany((_type) => CommentEntity, (comment) => comment.user)
  // comments: CommentEntity[];

  // @OneToMany((_type) => NotificationEntity, (notification) => notification.user)
  // notifications: NotificationEntity[];

  @AfterInsert()
  logInsert() {
    console.log(`Inserted User of id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User of id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User Removed`);
  }
}
