import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFinancesTable1732542692004 implements MigrationInterface {
    name = 'CreateFinancesTable1732542692004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."finances_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "finances" ("id" SERIAL NOT NULL, "description" text NOT NULL, "year" integer NOT NULL, "income" integer NULL, "expenses" integer NULL, "profits" integer NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."finances_status_enum" NOT NULL DEFAULT 'pending', "notes" text, "attachmentsId" integer, "companyId" integer, CONSTRAINT "REL_276db7ce6b3e149af31b6b1b48" UNIQUE ("attachmentsId"), CONSTRAINT "PK_dd84717ec8f1c29d8dd8687b6fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "finances" ADD CONSTRAINT "FK_276db7ce6b3e149af31b6b1b48a" FOREIGN KEY ("attachmentsId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finances" ADD CONSTRAINT "FK_ef0bfa7371c7d658fe99344e768" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" DROP CONSTRAINT "FK_ef0bfa7371c7d658fe99344e768"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP CONSTRAINT "FK_276db7ce6b3e149af31b6b1b48a"`);
        await queryRunner.query(`DROP TABLE "finances"`);
        await queryRunner.query(`DROP TYPE "public"."finances_status_enum"`);
    }

}
