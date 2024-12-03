import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotesFieldToBookings1732104362258
  implements MigrationInterface
{
  name = 'AddNotesFieldToBookings1732104362258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" ADD "notes" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "notes"`);
  }
}
