import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFinancesTables1740137471524 implements MigrationInterface {
    name = 'UpdateFinancesTables1740137471524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "revenues" ALTER COLUMN "year" SET DEFAULT date_part('year', now())::INTEGER`);
        await queryRunner.query(`ALTER TABLE "opex" ALTER COLUMN "year" SET DEFAULT date_part('year', now())::INTEGER`);
        await queryRunner.query(`ALTER TABLE "cost_of_sales" ALTER COLUMN "year" SET DEFAULT date_part('year', now())::INTEGER`);
        await queryRunner.query(`ALTER TABLE "finances" ALTER COLUMN "year" SET DEFAULT date_part('year', now())::INTEGER`);
        await queryRunner.query(`ALTER TABLE "balance_sheets" ALTER COLUMN "year" SET DEFAULT date_part('year', now())::INTEGER`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balance_sheets" ALTER COLUMN "year" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "finances" ALTER COLUMN "year" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cost_of_sales" ALTER COLUMN "year" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "opex" ALTER COLUMN "year" SET DEFAULT date_part('year', CURRENT_DATE)`);
        await queryRunner.query(`ALTER TABLE "revenues" ALTER COLUMN "year" SET DEFAULT date_part('year', CURRENT_DATE)`);
    }

}
