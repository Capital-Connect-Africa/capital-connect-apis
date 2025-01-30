import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDealPipelineTables1738236305702
  implements MigrationInterface
{
  name = 'CreateDealPipelineTables1738236305702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "deal-pipelines" ("id" SERIAL NOT NULL, "name" character varying NOT NULL DEFAULT 'Default Pipeline', "maxNumberOfStages" integer NOT NULL DEFAULT '7', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_8451b22e51f3ab7eb656618ac49" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deal-stages" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "progress" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pipelineId" integer, CONSTRAINT "PK_627e51d8e3cbd33f8e607889253" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deal-attachments" ("id" SERIAL NOT NULL, "historyId" integer, "attachmentId" integer NOT NULL, CONSTRAINT "PK_b6f51be0e4ee224107104a8f3cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deal-stage-history" ("id" SERIAL NOT NULL, "valueShift" numeric(20,2) NOT NULL DEFAULT '0', "movedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "dealId" integer, "fromStageId" integer, "toStageId" integer NOT NULL, CONSTRAINT "PK_a1519077d68714e470951e8d348" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deals" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "value" numeric(20,2) NOT NULL, "status" "public"."deals_status_enum" NOT NULL DEFAULT 'active', "closedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "customerId" integer NOT NULL, "stageId" integer, CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deal-customers" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying, "phone" character varying, "userId" integer, CONSTRAINT "PK_23977ed811d60d1095f763ca73a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-pipelines" ADD CONSTRAINT "FK_d77bf2a864fb0311ec5b35b0546" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stages" ADD CONSTRAINT "FK_5d58c9b88800b5ea5185ff2c3dd" FOREIGN KEY ("pipelineId") REFERENCES "deal-pipelines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-attachments" ADD CONSTRAINT "FK_ed835006a66d38db922a5cbc84e" FOREIGN KEY ("historyId") REFERENCES "deal-stage-history"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-attachments" ADD CONSTRAINT "FK_5e93ce1e988f90665a45846dc56" FOREIGN KEY ("attachmentId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stage-history" ADD CONSTRAINT "FK_b7e55f5133db90d103a787484db" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stage-history" ADD CONSTRAINT "FK_e30a457d85d58c11b5376660a32" FOREIGN KEY ("fromStageId") REFERENCES "deal-stages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stage-history" ADD CONSTRAINT "FK_57924f897712dabeabc6c58aec7" FOREIGN KEY ("toStageId") REFERENCES "deal-stages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" ADD CONSTRAINT "FK_e39412ed3656c8984363c21f561" FOREIGN KEY ("customerId") REFERENCES "deal-customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" ADD CONSTRAINT "FK_f068c4ddc2ff7fcc36fd07decf7" FOREIGN KEY ("stageId") REFERENCES "deal-stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-customers" ADD CONSTRAINT "FK_1ec69675b70f294e18d51d03622" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deal-customers" DROP CONSTRAINT "FK_1ec69675b70f294e18d51d03622"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" DROP CONSTRAINT "FK_f068c4ddc2ff7fcc36fd07decf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deals" DROP CONSTRAINT "FK_e39412ed3656c8984363c21f561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stage-history" DROP CONSTRAINT "FK_57924f897712dabeabc6c58aec7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-stage-history" DROP CONSTRAINT "FK_e30a457d85d58c11b5376660a32"`,
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
      `ALTER TABLE "deal-stages" DROP CONSTRAINT "FK_5d58c9b88800b5ea5185ff2c3dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deal-pipelines" DROP CONSTRAINT "FK_d77bf2a864fb0311ec5b35b0546"`,
    );
    await queryRunner.query(`DROP TABLE "deal-customers"`);
    await queryRunner.query(`DROP TABLE "deals"`);
    await queryRunner.query(`DROP TABLE "deal-stage-history"`);
    await queryRunner.query(`DROP TABLE "deal-attachments"`);
    await queryRunner.query(`DROP TABLE "deal-stages"`);
    await queryRunner.query(`DROP TABLE "deal-pipelines"`);
  }
}
