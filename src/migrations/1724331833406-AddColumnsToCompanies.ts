import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnsToCompanies1724331833406 implements MigrationInterface {
    name = 'AddColumnsToCompanies1724331833406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" ADD "investmentStructures" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "useOfFunds" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "esgFocusAreas" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "fundsNeeded" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "fundsNeeded"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "esgFocusAreas"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "useOfFunds"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "investmentStructures"`);
    }

}
