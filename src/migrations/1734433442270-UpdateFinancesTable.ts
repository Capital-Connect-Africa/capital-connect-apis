import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFinancesTable1734433442270 implements MigrationInterface {
    name = 'UpdateFinancesTable1734433442270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" ADD "costOfSales" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebitda" integer NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebit" integer NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "taxes" integer NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "taxes"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebit"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebitda"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "costOfSales"`);
    }

}

