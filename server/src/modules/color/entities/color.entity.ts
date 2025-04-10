import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('colors')
export class ColorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column({ name: 'user_id' })
  userId: string;

  // @OneToMany((_type) => ProductVariantEntity, (items) => items.color)
  // productVariants!: ProductVariantEntity[];
}
