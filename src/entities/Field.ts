import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Field {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("varchar", { length: 75, nullable: false })
  name: string

  @Column("varchar", { length: 20, nullable: false })
  user: string

  @Column("varchar", { length: 45, nullable: false })
  password: string

  @Column("int", { nullable: false })
  numberOfRatings: number

  @Column("int", { nullable: false })
  sumOfRatings: number

  @Column("varchar", { length: 75, nullable: false })
  image: string

  @Column("varchar", { length: 75, nullable: false })
  location: string

  @Column("varchar", { length: 25, nullable: false })
  phone: string

  @Column("varchar", { length: 10, nullable: false })
  price: string
}
