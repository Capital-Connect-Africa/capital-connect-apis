import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnToCompanies1728384700939 implements MigrationInterface {
    name = 'AddColumnToCompanies1728384700939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" ADD "segments" text array NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "segments"`);
    }

}
