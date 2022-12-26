import { MigrationInterface, QueryRunner } from "typeorm"

export class deleteBookingDeletedTable1672088260430
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS booking_deleted")
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE TABELE booking_deleted")
  }
}
