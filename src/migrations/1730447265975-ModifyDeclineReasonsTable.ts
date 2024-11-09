import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyDeclineReasonsTable1730447265975 implements MigrationInterface {
    name = 'ModifyDeclineReasonsTable1730447265975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."decline-reasons_declinerole_enum" AS ENUM('business', 'investor')`);
        await queryRunner.query(`ALTER TABLE "decline-reasons" ADD "declineRole" "public"."decline-reasons_declinerole_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decline-reasons" DROP COLUMN "declineRole"`);
        await queryRunner.query(`DROP TYPE "public"."decline-reasons_declinerole_enum"`);
    }

}
