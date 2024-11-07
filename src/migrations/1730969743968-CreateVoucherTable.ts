import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVoucherTable1730969743968 implements MigrationInterface {
    name = 'CreateVoucherTable1730969743968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b261fc54cc414ed7d328f31c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a857e7976ba7d94b215425fa7"`);
        await queryRunner.query(`CREATE TYPE "public"."rules_operator_enum" AS ENUM('eq', 'lt', 'gt', 'lte', 'gte', 'between', 'exists,')`);
        await queryRunner.query(`CREATE TABLE "rules" ("id" SERIAL NOT NULL, "userProperty" character varying NOT NULL, "operator" "public"."rules_operator_enum" NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_10fef696a7d61140361b1b23608" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."vouchers_type_enum" AS ENUM('advisory-session', 'subscription-plan')`);
        await queryRunner.query(`CREATE TABLE "vouchers" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "type" "public"."vouchers_type_enum" NOT NULL, "maxUses" integer NOT NULL, "percentageDiscount" numeric(5,2) NOT NULL, "maxAmount" integer NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "voucher_eligibility_rules" ("voucher" integer NOT NULL, "rule" integer NOT NULL, CONSTRAINT "PK_9ae038b3842b2bb5f2cebb793b8" PRIMARY KEY ("voucher", "rule"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8796014f5570628c5b81237852" ON "voucher_eligibility_rules" ("voucher") `);
        await queryRunner.query(`CREATE INDEX "IDX_21422343ba675181dcb7cc38d4" ON "voucher_eligibility_rules" ("rule") `);
        await queryRunner.query(`ALTER TABLE "contact_persons" ALTER COLUMN "hasAccess" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "segments" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" ALTER COLUMN "features" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_2b261fc54cc414ed7d328f31c0" ON "special_criteria_questions" ("specialCriteriaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a857e7976ba7d94b215425fa7" ON "special_criteria_questions" ("questionsId") `);
        await queryRunner.query(`ALTER TABLE "voucher_eligibility_rules" ADD CONSTRAINT "FK_8796014f5570628c5b812378522" FOREIGN KEY ("voucher") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "voucher_eligibility_rules" ADD CONSTRAINT "FK_21422343ba675181dcb7cc38d49" FOREIGN KEY ("rule") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "voucher_eligibility_rules" DROP CONSTRAINT "FK_21422343ba675181dcb7cc38d49"`);
        await queryRunner.query(`ALTER TABLE "voucher_eligibility_rules" DROP CONSTRAINT "FK_8796014f5570628c5b812378522"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a857e7976ba7d94b215425fa7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b261fc54cc414ed7d328f31c0"`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" ALTER COLUMN "features" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "segments" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact_persons" ALTER COLUMN "hasAccess" DROP NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21422343ba675181dcb7cc38d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8796014f5570628c5b81237852"`);
        await queryRunner.query(`DROP TABLE "voucher_eligibility_rules"`);
        await queryRunner.query(`DROP TABLE "vouchers"`);
        await queryRunner.query(`DROP TYPE "public"."vouchers_type_enum"`);
        await queryRunner.query(`DROP TABLE "rules"`);
        await queryRunner.query(`DROP TYPE "public"."rules_operator_enum"`);
        await queryRunner.query(`CREATE INDEX "IDX_6a857e7976ba7d94b215425fa7" ON "special_criteria_questions" ("questionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b261fc54cc414ed7d328f31c0" ON "special_criteria_questions" ("specialCriteriaId") `);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06" FOREIGN KEY ("specialCriteriaId") REFERENCES "special_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
