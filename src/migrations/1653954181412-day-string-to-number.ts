import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class dayStringToNumber1653954181412 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "fixed_booking",
      "day",
      new TableColumn({
        name: "day",
        isNullable: false,
        type: "TINYINT",
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "fixed_booking",
      "day",
      new TableColumn({
        name: "day",
        isNullable: false,
        type: "varchar",
        length: "45",
      })
    )
  }
}
