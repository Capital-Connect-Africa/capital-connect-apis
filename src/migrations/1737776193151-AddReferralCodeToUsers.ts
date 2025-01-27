import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReferralCodeToUsers1737776193151 implements MigrationInterface {
  name = 'AddReferralCodeToUsers1737776193151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "referralCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_b7f8278f4e89249bb75c9a15899" UNIQUE ("referralCode")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_b7f8278f4e89249bb75c9a15899"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "referralCode"`);
  }
}
