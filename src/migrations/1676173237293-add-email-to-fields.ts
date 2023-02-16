import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class addEmailToFields1676173237293 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "field",
      new TableColumn({
        name: "email",
        isNullable: false,
        type: "varchar",
        length: "200",
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("field", "email")
  }
}
