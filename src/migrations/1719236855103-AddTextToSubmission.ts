import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTextToSubmission1719236855103 implements MigrationInterface {
    name = 'AddTextToSubmission1719236855103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submission" ADD "text" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submission" DROP COLUMN "text"`);
    }

}
