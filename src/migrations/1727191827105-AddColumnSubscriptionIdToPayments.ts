import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnSubscriptionIdToPayments1727191827105 implements MigrationInterface {
    name = 'AddColumnSubscriptionIdToPayments1727191827105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b261fc54cc414ed7d328f31c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a857e7976ba7d94b215425fa7"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "userSubscriptionId" integer`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" DROP CONSTRAINT "UQ_f5bb908755354652f05d96a7f2f"`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" DROP COLUMN "name"`);
        await queryRunner.query(`CREATE TYPE "public"."subscription_tiers_name_enum" AS ENUM('basic', 'plus', 'pro', 'elite')`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" ADD "name" "public"."subscription_tiers_name_enum" NOT NULL DEFAULT 'basic'`);
        await queryRunner.query(`CREATE INDEX "IDX_2b261fc54cc414ed7d328f31c0" ON "special_criteria_questions" ("specialCriteriaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a857e7976ba7d94b215425fa7" ON "special_criteria_questions" ("questionsId") `);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_ae2c8a68a95c06497086c055887" FOREIGN KEY ("userSubscriptionId") REFERENCES "user_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06" FOREIGN KEY ("specialCriteriaId") REFERENCES "special_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_ae2c8a68a95c06497086c055887"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a857e7976ba7d94b215425fa7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b261fc54cc414ed7d328f31c0"`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_tiers_name_enum"`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription_tiers" ADD CONSTRAINT "UQ_f5bb908755354652f05d96a7f2f" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "userSubscriptionId"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`CREATE INDEX "IDX_6a857e7976ba7d94b215425fa7" ON "special_criteria_questions" ("questionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b261fc54cc414ed7d328f31c0" ON "special_criteria_questions" ("specialCriteriaId") `);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06" FOREIGN KEY ("specialCriteriaId") REFERENCES "special_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
