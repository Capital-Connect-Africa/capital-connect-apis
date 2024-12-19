import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFinancesTable1734590264847 implements MigrationInterface {
    name = 'UpdateFinancesTable1734590264847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" ADD "costOfSales" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebitda" bigint NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebit" bigint NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "taxes" bigint NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "taxes"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebit"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebitda"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "costOfSales"`);
    }

}
