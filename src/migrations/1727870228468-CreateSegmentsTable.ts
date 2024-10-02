import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSegmentsTable1727870228468 implements MigrationInterface {
    name = 'CreateSegmentsTable1727870228468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "segments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "subSectorId" integer, CONSTRAINT "PK_beff1eec19679fe8ad4f291f04e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "segments" ADD CONSTRAINT "FK_e7970a15119f30a4c32a189ffba" FOREIGN KEY ("subSectorId") REFERENCES "subsectors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "segments" DROP CONSTRAINT "FK_e7970a15119f30a4c32a189ffba"`);
        await queryRunner.query(`DROP TABLE "segments"`);
    }

}
