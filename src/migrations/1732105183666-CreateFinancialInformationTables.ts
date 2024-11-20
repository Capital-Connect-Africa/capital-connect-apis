import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFinancialInformationTables1732105183666 implements MigrationInterface {
    name = 'CreateFinancialInformationTables1732105183666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "finance_questions" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "description" text, CONSTRAINT "PK_0760aef07d2a0e7be3489ed4a4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."finance_answers_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "finance_answers" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "amount" integer NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."finance_answers_status_enum" NOT NULL DEFAULT 'pending', "notes" text NULL, "attachmentsId" integer NULL, "questionId" integer, "userId" integer, CONSTRAINT "REL_d5acaa85b87d4ecee8f1c63dd7" UNIQUE ("attachmentsId"), CONSTRAINT "PK_773fe8e12220235515957146826" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "finance_answers" ADD CONSTRAINT "FK_d5acaa85b87d4ecee8f1c63dd78" FOREIGN KEY ("attachmentsId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finance_answers" ADD CONSTRAINT "FK_f7f898caed62b51c9c8a2327339" FOREIGN KEY ("questionId") REFERENCES "finance_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finance_answers" ADD CONSTRAINT "FK_cbc0b5113fae42636166967f8f3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finance_answers" DROP CONSTRAINT "FK_cbc0b5113fae42636166967f8f3"`);
        await queryRunner.query(`ALTER TABLE "finance_answers" DROP CONSTRAINT "FK_f7f898caed62b51c9c8a2327339"`);
        await queryRunner.query(`ALTER TABLE "finance_answers" DROP CONSTRAINT "FK_d5acaa85b87d4ecee8f1c63dd78"`);
        await queryRunner.query(`DROP TABLE "finance_answers"`);
        await queryRunner.query(`DROP TYPE "public"."finance_answers_status_enum"`);
        await queryRunner.query(`DROP TABLE "finance_questions"`);
    }

}
