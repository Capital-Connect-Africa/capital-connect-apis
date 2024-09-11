import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReuestedToMatchStatus1725629442550 implements MigrationInterface {
    name = 'AddReuestedToMatchStatus1725629442550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."match_makings_status_enum" RENAME TO "match_makings_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."match_makings_status_enum" AS ENUM('interesting', 'declined', 'connected', 'requested')`);
        await queryRunner.query(`ALTER TABLE "match_makings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "match_makings" ALTER COLUMN "status" TYPE "public"."match_makings_status_enum" USING "status"::"text"::"public"."match_makings_status_enum"`);
        await queryRunner.query(`ALTER TABLE "match_makings" ALTER COLUMN "status" SET DEFAULT 'interesting'`);
        await queryRunner.query(`DROP TYPE "public"."match_makings_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."match_makings_status_enum_old" AS ENUM('interesting', 'declined', 'connected')`);
        await queryRunner.query(`ALTER TABLE "match_makings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "match_makings" ALTER COLUMN "status" TYPE "public"."match_makings_status_enum_old" USING "status"::"text"::"public"."match_makings_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "match_makings" ALTER COLUMN "status" SET DEFAULT 'interesting'`);
        await queryRunner.query(`DROP TYPE "public"."match_makings_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."match_makings_status_enum_old" RENAME TO "match_makings_status_enum"`);
    }

}

