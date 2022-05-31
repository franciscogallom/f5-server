import { MigrationInterface, QueryRunner } from "typeorm"

export class renameDateToDay1653952177480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("fixed_booking", "date", "day")
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("fixed_booking", "day", "date")
  }
}
