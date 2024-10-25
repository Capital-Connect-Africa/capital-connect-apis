import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyContactPersonTable1729851268170 implements MigrationInterface {
    name = 'ModifyContactPersonTable1729851268170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_persons" ADD "hasAccess" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_persons" DROP COLUMN "hasAccess"`);
    }

}
