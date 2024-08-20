import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeclineReasonsToMatchmakings1724109861442 implements MigrationInterface {
    name = 'AddDeclineReasonsToMatchmakings1724109861442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "decline-reasons" ("id" SERIAL NOT NULL, "reason" character varying NOT NULL, CONSTRAINT "PK_81cff12d27cb84a4c6781c444f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "match_makings" ADD "declineReasons" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_makings" DROP COLUMN "declineReasons"`);
        await queryRunner.query(`DROP TABLE "decline-reasons"`);
    }
}
