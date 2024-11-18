import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnToCompanies1731930615748 implements MigrationInterface {
    name = 'AddColumnToCompanies1731930615748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" ADD "isHidden" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "isHidden"`);
    }
}
