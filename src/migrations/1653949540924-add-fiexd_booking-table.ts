import { MigrationInterface, QueryRunner } from "typeorm"

export class addFiexdBookingTable1653949540924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE fixed_booking (
                field_username VARCHAR(45) NOT NULL,
                user_username VARCHAR(45) NOT NULL,
                field VARCHAR(45) NOT NULL,
                hour VARCHAR(3) NOT NULL,
                timestamp VARCHAR(45) NOT NULL,
                date VARCHAR(45) NOT NULL,
                id VARCHAR(36) NOT NULL,
                PRIMARY KEY (id));
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("fixed_booking")
  }
}
