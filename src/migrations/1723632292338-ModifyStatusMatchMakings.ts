import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyStatusMatchMakings1723632292338 implements MigrationInterface {
    name = 'ModifyStatusMatchMakings1723632292338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_makings" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."match_makings_status_enum" AS ENUM('interesting', 'declined', 'connected')`);
        await queryRunner.query(`ALTER TABLE "match_makings" ADD "status" "public"."match_makings_status_enum" NOT NULL DEFAULT 'interesting'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_makings" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."match_makings_status_enum"`);
        await queryRunner.query(`ALTER TABLE "match_makings" ADD "status" character varying NOT NULL DEFAULT 'interesting'`);
    }

}
