import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyFinancesTable1737989262301 implements MigrationInterface {
    name = 'ModifyFinancesTable1737989262301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" ADD "totalRevenues" bigint`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "totalCosts" bigint`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "grossProfit" bigint`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebitda" bigint`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebit" bigint`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "profitBeforeTax" bigint`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "netProfit" bigint`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "grossMargin" character varying`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebitdaMargin" character varying`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebitdaMargin"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "grossMargin"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "netProfit"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "profitBeforeTax"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebit"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebitda"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "grossProfit"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "totalCosts"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "totalRevenues"`);
    }

}
