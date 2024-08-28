import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSpecialCriteriaTable1724671467659 implements MigrationInterface {
    name = 'CreateSpecialCriteriaTable1724671467659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "special_criteria" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "investorProfileId" integer, CONSTRAINT "PK_4beba29a395e077ff6c4d4cad28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "special_criteria_questions" ("specialCriteriaId" integer NOT NULL, "questionsId" integer NOT NULL, CONSTRAINT "PK_ad095e47c8c65664a2e5bb2c408" PRIMARY KEY ("specialCriteriaId", "questionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2b261fc54cc414ed7d328f31c0" ON "special_criteria_questions" ("specialCriteriaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a857e7976ba7d94b215425fa7" ON "special_criteria_questions" ("questionsId") `);
        await queryRunner.query(`ALTER TABLE "special_criteria" ADD CONSTRAINT "FK_43bc88fb584f6666b5fb1e46611" FOREIGN KEY ("investorProfileId") REFERENCES "investor_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06" FOREIGN KEY ("specialCriteriaId") REFERENCES "special_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06"`);
        await queryRunner.query(`ALTER TABLE "special_criteria" DROP CONSTRAINT "FK_43bc88fb584f6666b5fb1e46611"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a857e7976ba7d94b215425fa7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b261fc54cc414ed7d328f31c0"`);
        await queryRunner.query(`DROP TABLE "special_criteria_questions"`);
        await queryRunner.query(`DROP TABLE "special_criteria"`);
    }

}
