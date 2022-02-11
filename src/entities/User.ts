import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("varchar", { length: 20, nullable: false })
  user: string

  @Column("varchar", { length: 100, nullable: false })
  password: string

  @Column("varchar", { length: 75, nullable: false })
  email: string

  @Column("varchar", { length: 25, nullable: true })
  phone: string

  @Column("varchar", { length: 25, nullable: false })
  created: string
}
