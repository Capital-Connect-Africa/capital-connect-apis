import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyEligibilityRuleUserProperyType1736488943719 implements MigrationInterface {
    name = 'ModifyEligibilityRuleUserProperyType1736488943719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."rules_userproperty_enum" AS ENUM('createdAt', 'referredBy', 'roles')`);
        await queryRunner.query(`ALTER TABLE "rules" ADD "userPropertyNew" "public"."rules_userproperty_enum"`);
        await queryRunner.query(`DELETE FROM "rules"  WHERE "userProperty" NOT IN ('createdAt', 'referredBy', 'roles')`);
        await queryRunner.query(`
            UPDATE "rules" 
            SET "userPropertyNew" = 
            CASE 
                WHEN "userProperty" = 'createdAt' THEN 'createdAt'::rules_userproperty_enum
                WHEN "userProperty" = 'referredBy' THEN 'referredBy'::rules_userproperty_enum
                WHEN "userProperty" = 'roles' THEN 'roles'::rules_userproperty_enum
            END;
        `);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "userProperty"`);
        await queryRunner.query(`ALTER TABLE "rules" RENAME COLUMN "userPropertyNew" TO "userProperty"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" ADD "userPropertyOld" character varying`);
        await queryRunner.query(`UPDATE "rules" SET "userPropertyOld" = "userProperty"::text`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "userProperty"`);
        await queryRunner.query(`ALTER TABLE "rules" RENAME COLUMN "userPropertyOld" TO "userProperty"`);
        await queryRunner.query(`DROP TYPE "public"."rules_userproperty_enum"`);
    }

}
