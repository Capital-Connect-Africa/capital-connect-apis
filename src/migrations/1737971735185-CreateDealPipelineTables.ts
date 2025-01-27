import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDealPipelineTables1737971735185
  implements MigrationInterface
{
  name = 'CreateDealPipelineTables1737971735185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "deal-customers" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying, "phone" character varying, "userId" integer, CONSTRAINT "PK_23977ed811d60d1095f763ca73a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deal-attachments" ("id" SERIAL NOT NULL, "historyId" integer NOT NULL, "attachmentId" integer NOT NULL, CONSTRAINT "PK_b6f51be0e4ee224107104a8f3cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deal-stage-history" ("id" SERIAL NOT NULL, "movedAt" TIMESTAMP NOT NULL DEFAULT now(), "dealId" integer NOT NULL, "stageId" integer NOT NULL, CONSTRAINT "PK_a1519077d68714e470951e8d348" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deal-stages" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "value" numeric(20,2) NOT NULL, "progress" integer NOT NULL, CONSTRAINT "UQ_922fda4270bae404389574c7615" UNIQUE ("name"), CONSTRAINT "PK_627e51d8e3cbd33f8e607889253" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."deals_status_enum" AS ENUM('won', 'lost', 'active', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "deals" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" "public"."deals_status_enum" NOT NULL DEFAULT 'active', "closedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "customerId" integer NOT NULL, "stageId" integer NOT NULL, CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-customers" ADD CONSTRAINT "FK_1ec69675b70f294e18d51d03622" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-attachments" ADD CONSTRAINT "FK_ed835006a66d38db922a5cbc84e" FOREIGN KEY ("historyId") REFERENCES "deal-stage-history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-attachments" ADD CONSTRAINT "FK_5e93ce1e988f90665a45846dc56" FOREIGN KEY ("attachmentId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stage-history" ADD CONSTRAINT "FK_b7e55f5133db90d103a787484db" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stage-history" ADD CONSTRAINT "FK_28db4e637befd0339de458b5833" FOREIGN KEY ("stageId") REFERENCES "deal-stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" ADD CONSTRAINT "FK_2ab80c329115e938c396ed5d418" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" ADD CONSTRAINT "FK_e39412ed3656c8984363c21f561" FOREIGN KEY ("customerId") REFERENCES "deal-customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" ADD CONSTRAINT "FK_f068c4ddc2ff7fcc36fd07decf7" FOREIGN KEY ("stageId") REFERENCES "deal-stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deals" DROP CONSTRAINT "FK_f068c4ddc2ff7fcc36fd07decf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" DROP CONSTRAINT "FK_e39412ed3656c8984363c21f561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" DROP CONSTRAINT "FK_2ab80c329115e938c396ed5d418"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stage-history" DROP CONSTRAINT "FK_28db4e637befd0339de458b5833"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stage-history" DROP CONSTRAINT "FK_b7e55f5133db90d103a787484db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-attachments" DROP CONSTRAINT "FK_5e93ce1e988f90665a45846dc56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-attachments" DROP CONSTRAINT "FK_ed835006a66d38db922a5cbc84e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-customers" DROP CONSTRAINT "FK_1ec69675b70f294e18d51d03622"`,
    );
    await queryRunner.query(`DROP TABLE "deals"`);
    await queryRunner.query(`DROP TYPE "public"."deals_status_enum"`);
    await queryRunner.query(`DROP TABLE "deal-stages"`);
    await queryRunner.query(`DROP TABLE "deal-stage-history"`);
    await queryRunner.query(`DROP TABLE "deal-attachments"`);
    await queryRunner.query(`DROP TABLE "deal-customers"`);
  }
}
