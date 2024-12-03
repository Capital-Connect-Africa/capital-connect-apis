import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionToRules1731163111766 implements MigrationInterface {
    name = 'AddDescriptionToRules1731163111766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" ADD "description" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "description"`);
    }

}
