import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDatesToProfiles1731492747398 implements MigrationInterface {
    name = 'AddDatesToProfiles1731492747398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_persons" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "contact_persons" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "contact_persons" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "contact_persons" DROP COLUMN "createdAt"`);
    }

}
