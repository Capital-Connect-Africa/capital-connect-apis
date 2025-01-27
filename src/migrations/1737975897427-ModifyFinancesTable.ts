import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyFinancesTable1737975897427 implements MigrationInterface {
    name = 'ModifyFinancesTable1737975897427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" ADD "totalRevenues" integer`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "totalCosts" integer`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "grossProfit" integer`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebitda" integer`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebit" integer`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "profitBeforeTax" integer`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "netProfit" integer`);
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
