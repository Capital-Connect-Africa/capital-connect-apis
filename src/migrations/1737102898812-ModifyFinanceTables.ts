import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyFinanceTables1737102898812 implements MigrationInterface {
    name = 'ModifyFinanceTables1737102898812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cost_of_sales" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "description" character varying NOT NULL, "value" integer NOT NULL, "financesId" integer, "companyId" integer, CONSTRAINT "PK_9d683518bddf12e729664d2bf41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "costOfSales"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebitda"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebit"`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "amorDep" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "interests" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "cost_of_sales" ADD CONSTRAINT "FK_0dfc3105117b80c3394c7a90f49" FOREIGN KEY ("financesId") REFERENCES "finances"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cost_of_sales" ADD CONSTRAINT "FK_ea1a40c3facad23bea074a8b7e9" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cost_of_sales" DROP CONSTRAINT "FK_ea1a40c3facad23bea074a8b7e9"`);
        await queryRunner.query(`ALTER TABLE "cost_of_sales" DROP CONSTRAINT "FK_0dfc3105117b80c3394c7a90f49"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "interests"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "amorDep"`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebit" bigint DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebitda" bigint DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "costOfSales" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "cost_of_sales"`);
    }

}
