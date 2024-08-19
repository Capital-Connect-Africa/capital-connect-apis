import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeclineReasonsToMatchMakings1724063028884 implements MigrationInterface {
    name = 'AddDeclineReasonsToMatchMakings1724063028884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "decline-reasons" ("id" SERIAL NOT NULL, "reason" character varying NOT NULL, CONSTRAINT "PK_81cff12d27cb84a4c6781c444f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "match_makings" ADD "declineReasons" text array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_makings" DROP COLUMN "declineReasons"`);
        await queryRunner.query(`DROP TABLE "decline-reasons"`);
    }
}
