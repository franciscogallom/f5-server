import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class FixedBooking {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("varchar", { length: 45, nullable: false })
  user_username: string

  @Column("varchar", { length: 45, nullable: false })
  field_username: string

  @Column("tinyint", { nullable: false })
  day: number

  @Column("tinyint", { nullable: false })
  hour: number

  @Column("tinyint", { nullable: false })
  field: number

  @Column("varchar", { length: 45, nullable: false })
  timestamp: string

  @Column("varchar", { length: 25, nullable: false })
  phone: string
}
