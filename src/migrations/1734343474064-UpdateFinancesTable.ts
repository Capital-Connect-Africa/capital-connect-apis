import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFinancesTable1734343474064 implements MigrationInterface {
    name = 'UpdateFinancesTable1734343474064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" ADD "costOfSales" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "EBITDA" integer NULL`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "EBIT" integer NULL`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "taxes" integer NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "taxes"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "EBIT"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "EBITDA"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "costOfSales"`);
    }

}
