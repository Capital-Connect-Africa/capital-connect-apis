import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDealPipelineTables1738057769461 implements MigrationInterface {
    name = 'CreateDealPipelineTables1738057769461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b261fc54cc414ed7d328f31c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a857e7976ba7d94b215425fa7"`);
        await queryRunner.query(`CREATE TABLE "deal-customers" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying, "phone" character varying, "userId" integer, CONSTRAINT "PK_23977ed811d60d1095f763ca73a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deal-stage-history" ("id" SERIAL NOT NULL, "valueShift" numeric(20,2) NOT NULL DEFAULT '0', "movedAt" TIMESTAMP NOT NULL DEFAULT now(), "dealId" integer, "fromStageId" integer, "toStageId" integer NOT NULL, CONSTRAINT "PK_a1519077d68714e470951e8d348" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deal-stages" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "progress" integer NOT NULL, "userId" integer, "dealId" integer, CONSTRAINT "UQ_922fda4270bae404389574c7615" UNIQUE ("name"), CONSTRAINT "PK_627e51d8e3cbd33f8e607889253" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deal-attachments" ("id" SERIAL NOT NULL, "dealId" integer, "stageId" integer, "attachmentId" integer NOT NULL, CONSTRAINT "PK_b6f51be0e4ee224107104a8f3cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."deals_status_enum" AS ENUM('won', 'lost', 'active', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "deals" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "value" numeric(20,2) NOT NULL, "status" "public"."deals_status_enum" NOT NULL DEFAULT 'active', "closedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer NOT NULL, "customerId" integer NOT NULL, "currentStageId" integer NOT NULL, CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "amorDep"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "interests"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_b7f8278f4e89249bb75c9a15899"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "referralCode"`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "costOfSales" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebitda" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "ebit" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "contact_persons" ALTER COLUMN "hasAccess" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "revenues" ALTER COLUMN "year" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "opex" ALTER COLUMN "year" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "finances" ALTER COLUMN "taxes" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "segments" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" ALTER COLUMN "availableFunding" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "special_criteria" ALTER COLUMN "globalVisible" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" ALTER COLUMN "features" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "userProperty" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vouchers" ALTER COLUMN "maxAmount" TYPE numeric`);
        await queryRunner.query(`CREATE INDEX "IDX_2b261fc54cc414ed7d328f31c0" ON "special_criteria_questions" ("specialCriteriaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a857e7976ba7d94b215425fa7" ON "special_criteria_questions" ("questionsId") `);
        await queryRunner.query(`ALTER TABLE "deal-customers" ADD CONSTRAINT "FK_1ec69675b70f294e18d51d03622" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal-stage-history" ADD CONSTRAINT "FK_b7e55f5133db90d103a787484db" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal-stage-history" ADD CONSTRAINT "FK_e30a457d85d58c11b5376660a32" FOREIGN KEY ("fromStageId") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal-stage-history" ADD CONSTRAINT "FK_57924f897712dabeabc6c58aec7" FOREIGN KEY ("toStageId") REFERENCES "stages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal-stages" ADD CONSTRAINT "FK_66c52c014d6d5b87268e8e26cb6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal-stages" ADD CONSTRAINT "FK_bf92326a7f270d519e1b95043be" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal-attachments" ADD CONSTRAINT "FK_b90dabf76e46be625a0dd6b6434" FOREIGN KEY ("dealId") REFERENCES "deals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal-attachments" ADD CONSTRAINT "FK_5f79e3d146336589ac6360b46e0" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deal-attachments" ADD CONSTRAINT "FK_5e93ce1e988f90665a45846dc56" FOREIGN KEY ("attachmentId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_384bbfa448d2c6951031c58de87" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_e39412ed3656c8984363c21f561" FOREIGN KEY ("customerId") REFERENCES "deal-customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_5c949249deb3003aee0d1964ff2" FOREIGN KEY ("currentStageId") REFERENCES "deal-stages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06" FOREIGN KEY ("specialCriteriaId") REFERENCES "special_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contact_person_profiles" ADD CONSTRAINT "FK_759258397ca4677b53f7e811dc4" FOREIGN KEY ("contactPersonId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "contact_person_profiles" ADD CONSTRAINT "FK_24c2993606e11f6c7aa84c3ce8d" FOREIGN KEY ("investorProfileId") REFERENCES "investor_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_person_profiles" DROP CONSTRAINT "FK_24c2993606e11f6c7aa84c3ce8d"`);
        await queryRunner.query(`ALTER TABLE "contact_person_profiles" DROP CONSTRAINT "FK_759258397ca4677b53f7e811dc4"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_5c949249deb3003aee0d1964ff2"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_e39412ed3656c8984363c21f561"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_384bbfa448d2c6951031c58de87"`);
        await queryRunner.query(`ALTER TABLE "deal-attachments" DROP CONSTRAINT "FK_5e93ce1e988f90665a45846dc56"`);
        await queryRunner.query(`ALTER TABLE "deal-attachments" DROP CONSTRAINT "FK_5f79e3d146336589ac6360b46e0"`);
        await queryRunner.query(`ALTER TABLE "deal-attachments" DROP CONSTRAINT "FK_b90dabf76e46be625a0dd6b6434"`);
        await queryRunner.query(`ALTER TABLE "deal-stages" DROP CONSTRAINT "FK_bf92326a7f270d519e1b95043be"`);
        await queryRunner.query(`ALTER TABLE "deal-stages" DROP CONSTRAINT "FK_66c52c014d6d5b87268e8e26cb6"`);
        await queryRunner.query(`ALTER TABLE "deal-stage-history" DROP CONSTRAINT "FK_57924f897712dabeabc6c58aec7"`);
        await queryRunner.query(`ALTER TABLE "deal-stage-history" DROP CONSTRAINT "FK_e30a457d85d58c11b5376660a32"`);
        await queryRunner.query(`ALTER TABLE "deal-stage-history" DROP CONSTRAINT "FK_b7e55f5133db90d103a787484db"`);
        await queryRunner.query(`ALTER TABLE "deal-customers" DROP CONSTRAINT "FK_1ec69675b70f294e18d51d03622"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a857e7976ba7d94b215425fa7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b261fc54cc414ed7d328f31c0"`);
        await queryRunner.query(`ALTER TABLE "vouchers" ALTER COLUMN "maxAmount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "userProperty" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" ALTER COLUMN "features" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "special_criteria" ALTER COLUMN "globalVisible" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" ALTER COLUMN "availableFunding" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "segments" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "finances" ALTER COLUMN "taxes" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "opex" ALTER COLUMN "year" SET DEFAULT EXTRACT(year FROM CURRENT_DATE)`);
        await queryRunner.query(`ALTER TABLE "revenues" ALTER COLUMN "year" SET DEFAULT EXTRACT(year FROM CURRENT_DATE)`);
        await queryRunner.query(`ALTER TABLE "contact_persons" ALTER COLUMN "hasAccess" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebit"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "ebitda"`);
        await queryRunner.query(`ALTER TABLE "finances" DROP COLUMN "costOfSales"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "referralCode" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_b7f8278f4e89249bb75c9a15899" UNIQUE ("referralCode")`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "interests" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "finances" ADD "amorDep" bigint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "deals"`);
        await queryRunner.query(`DROP TYPE "public"."deals_status_enum"`);
        await queryRunner.query(`DROP TABLE "deal-attachments"`);
        await queryRunner.query(`DROP TABLE "deal-stages"`);
        await queryRunner.query(`DROP TABLE "deal-stage-history"`);
        await queryRunner.query(`DROP TABLE "deal-customers"`);
        await queryRunner.query(`CREATE INDEX "IDX_6a857e7976ba7d94b215425fa7" ON "special_criteria_questions" ("questionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b261fc54cc414ed7d328f31c0" ON "special_criteria_questions" ("specialCriteriaId") `);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06" FOREIGN KEY ("specialCriteriaId") REFERENCES "special_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
