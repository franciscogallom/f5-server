import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("varchar", { length: 45, nullable: false })
  user: string

  @Column("varchar", { length: 45, nullable: false })
  date: string

  @Column("varchar", { length: 45, nullable: false })
  fieldUser: string

  @Column("varchar", { length: 3, nullable: false })
  hour: string

  @Column("varchar", { length: 30, nullable: false })
  field: string

  @Column("varchar", { length: 45, nullable: false })
  timestamp: string

  @Column("boolean", { default: false, nullable: false })
  cancelled: boolean
}
