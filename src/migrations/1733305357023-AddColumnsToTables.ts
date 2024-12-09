import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnsToTables1733305357023 implements MigrationInterface {
    name = 'AddColumnsToTables1733305357023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "revenues" ADD "year" integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)`);
        await queryRunner.query(`ALTER TABLE "revenues" ADD "companyId" integer`);
        await queryRunner.query(`ALTER TABLE "opex" ADD "year" integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)`);
        await queryRunner.query(`ALTER TABLE "opex" ADD "companyId" integer`);
        await queryRunner.query(`ALTER TABLE "revenues" ADD CONSTRAINT "FK_8771ff137042c717bfd65b14319" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "opex" ADD CONSTRAINT "FK_a7555246cb357d0dd4199202e7b" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "opex" DROP CONSTRAINT "FK_a7555246cb357d0dd4199202e7b"`);
        await queryRunner.query(`ALTER TABLE "revenues" DROP CONSTRAINT "FK_8771ff137042c717bfd65b14319"`);
        await queryRunner.query(`ALTER TABLE "opex" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "opex" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "revenues" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "revenues" DROP COLUMN "year"`);
    }

}
