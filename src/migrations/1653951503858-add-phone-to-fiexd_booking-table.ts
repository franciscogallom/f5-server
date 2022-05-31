import { Column, MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class addPhoneToFiexdBookingTable1653951503858
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "fixed_booking",
      new TableColumn({
        name: "phone",
        isNullable: false,
        type: "varchar",
        length: "25",
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("fixed_booking", "phone")
  }
}
