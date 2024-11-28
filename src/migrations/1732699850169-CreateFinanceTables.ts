import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFinanceTables1732699850169 implements MigrationInterface {
    name = 'CreateFinanceTables1732699850169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "revenues" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "value" integer NOT NULL, "financesId" integer, CONSTRAINT "PK_6e25eff5dd513bda2556a3d9370" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "opex" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "value" integer NOT NULL, "financesId" integer, CONSTRAINT "PK_8199bf0f6a189d56fda0c87787a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."finances_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "finances" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "notes" text, "revenues" integer[] DEFAULT '{}', "opex" integer[] DEFAULT '{}', "status" "public"."finances_status_enum" NOT NULL DEFAULT 'pending', "attachmentsId" integer, "companyId" integer, "userId" integer,"createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_276db7ce6b3e149af31b6b1b48" UNIQUE ("attachmentsId"), CONSTRAINT "PK_dd84717ec8f1c29d8dd8687b6fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "revenues" ADD CONSTRAINT "FK_20789c7cbfae9d4b0611b6e78ec" FOREIGN KEY ("financesId") REFERENCES "finances"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "opex" ADD CONSTRAINT "FK_682293c617be5f023007d26cfbe" FOREIGN KEY ("financesId") REFERENCES "finances"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finances" ADD CONSTRAINT "FK_276db7ce6b3e149af31b6b1b48a" FOREIGN KEY ("attachmentsId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finances" ADD CONSTRAINT "FK_ef0bfa7371c7d658fe99344e768" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finances" ADD CONSTRAINT "FK_29d58d04e6b88654ede43247667" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "revenues"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "opex"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" DROP CONSTRAINT "FK_29d58d04e6b88654ede43247667"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP CONSTRAINT "FK_ef0bfa7371c7d658fe99344e768"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP CONSTRAINT "FK_276db7ce6b3e149af31b6b1b48a"`);
        await queryRunner.query(`ALTER TABLE "opex" DROP CONSTRAINT "FK_682293c617be5f023007d26cfbe"`);
        await queryRunner.query(`ALTER TABLE "revenues" DROP CONSTRAINT "FK_20789c7cbfae9d4b0611b6e78ec"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN IF EXISTS "revenues"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN IF EXISTS "opex"`);
        await queryRunner.query(`DROP TABLE "finances"`);
        await queryRunner.query(`DROP TYPE "public"."finances_status_enum"`);
        await queryRunner.query(`DROP TABLE "opex"`);
        await queryRunner.query(`DROP TABLE "revenues"`);
   }

}
