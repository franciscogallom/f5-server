import { TableColumn, MigrationInterface, QueryRunner } from "typeorm"

export class hourStringToNumber1653956845278 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "fixed_booking",
      "hour",
      new TableColumn({
        name: "hour",
        isNullable: false,
        type: "TINYINT",
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "fixed_booking",
      "hour",
      new TableColumn({
        name: "hour",
        isNullable: false,
        type: "varchar",
        length: "3",
      })
    )
  }
}
