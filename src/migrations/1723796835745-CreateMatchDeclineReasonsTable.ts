import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMatchDeclineReasonsTable1723796835745 implements MigrationInterface {
    name = 'CreateMatchDeclineReasonsTable1723796835745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "match_decline-reasons" ("id" SERIAL NOT NULL, "reason" text NOT NULL, "matchMakingId" integer, CONSTRAINT "PK_0075f78614616a345d3687aaeec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "match_decline-reasons" ADD CONSTRAINT "FK_3c4dc26c42ab5f8408a59c7929f" FOREIGN KEY ("matchMakingId") REFERENCES "match_makings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_decline-reasons" DROP CONSTRAINT "FK_3c4dc26c42ab5f8408a59c7929f"`);
        await queryRunner.query(`DROP TABLE "match_decline-reasons"`);
    }

}
