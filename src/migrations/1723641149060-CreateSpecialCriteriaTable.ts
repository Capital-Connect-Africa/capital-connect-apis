import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSpecialCriteriaTable1723641149060 implements MigrationInterface {
    name = 'CreateSpecialCriteriaTable1723641149060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "special_criteria" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "investorProfileId" integer, CONSTRAINT "PK_4beba29a395e077ff6c4d4cad28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "special_criteria" ADD CONSTRAINT "FK_43bc88fb584f6666b5fb1e46611" FOREIGN KEY ("investorProfileId") REFERENCES "investor_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions_questions" ADD CONSTRAINT "FK_dc8997bfe5f3551209e331f4c24" FOREIGN KEY ("specialCriteriaId") REFERENCES "special_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria_questions_questions" DROP CONSTRAINT "FK_dc8997bfe5f3551209e331f4c24"`);
        await queryRunner.query(`ALTER TABLE "special_criteria" DROP CONSTRAINT "FK_43bc88fb584f6666b5fb1e46611"`);
        await queryRunner.query(`DROP TABLE "special_criteria"`);
    }

}
