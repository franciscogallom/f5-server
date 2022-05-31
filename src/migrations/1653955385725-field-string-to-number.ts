import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class fieldStringToNumber1653955385725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "fixed_booking",
      "field",
      new TableColumn({
        name: "field",
        isNullable: false,
        type: "TINYINT",
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "fixed_booking",
      "field",
      new TableColumn({
        name: "field",
        isNullable: false,
        type: "varchar",
        length: "45",
      })
    )
  }
}
