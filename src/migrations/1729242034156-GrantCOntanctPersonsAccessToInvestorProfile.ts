import { MigrationInterface, QueryRunner } from "typeorm";

export class GrantCOntanctPersonsAccessToInvestorProfile1729242034156 implements MigrationInterface {
    name = 'GrantCOntanctPersonsAccessToInvestorProfile1729242034156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_person_profiles" ("contactPersonId" integer NOT NULL, "investorProfileId" integer NOT NULL, CONSTRAINT "PK_5d8e19bb535d20ae796156ab9d8" PRIMARY KEY ("contactPersonId", "investorProfileId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_759258397ca4677b53f7e811dc" ON "contact_person_profiles" ("contactPersonId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24c2993606e11f6c7aa84c3ce8" ON "contact_person_profiles" ("investorProfileId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_24c2993606e11f6c7aa84c3ce8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_759258397ca4677b53f7e811dc"`);
        await queryRunner.query(`DROP TABLE "contact_person_profiles"`);
    }

}
