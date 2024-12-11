import { MigrationInterface, QueryRunner } from "typeorm";
export class UpdateInvestorProfilesTable1733224452820 implements MigrationInterface {
    name = 'UpdateInvestorProfilesTable1733224452820'
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_profiles" ADD "availableFundingBigInt" bigint`);
        await queryRunner.query(`UPDATE "investor_profiles" SET "availableFundingBigInt" = CAST("availableFunding" AS bigint)`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" DROP COLUMN "availableFunding"`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" RENAME COLUMN "availableFundingBigInt" TO "availableFunding"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_profiles" ADD "availableFundingBigInt" integer`);
        await queryRunner.query(`UPDATE "investor_profiles" SET "availableFundingBigInt" = CAST("availableFunding" AS integer)`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" DROP COLUMN "availableFunding"`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" RENAME COLUMN "availableFundingBigInt" TO "availableFunding"`);
    }
    
}
