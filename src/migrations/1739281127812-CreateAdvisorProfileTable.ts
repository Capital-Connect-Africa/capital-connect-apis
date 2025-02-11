import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdvisorProfileTable1739281127812 implements MigrationInterface {
    name = 'CreateAdvisorProfileTable1739281127812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."advisor_profile_roles_enum" AS ENUM('Capital Raising Advisor', 'Investment Advisor', 'Business Model Expert', 'Strategy Expert')`);
        await queryRunner.query(`CREATE TYPE "public"."advisor_profile_servicesoffered_enum" AS ENUM('Investor Matching', 'Fundraising Strategy Development', 'Pitch Deck Development', 'Due Diligence Support', 'Negotiation Assistance', 'Fund Structuring')`);
        await queryRunner.query(`CREATE TYPE "public"."advisor_profile_feestructure_enum" AS ENUM('Flat Fee', 'Hourly Rate', 'Commission-based')`);
        await queryRunner.query(`CREATE TABLE "advisor_profile" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "roles" "public"."advisor_profile_roles_enum" array NOT NULL, "email" character varying NOT NULL, "phone" character varying, "website" character varying, "professionalSummary" text NOT NULL, "personalPitch" text NOT NULL, "capitalRaisingStrategies" text array NOT NULL, "industryFocus" text array NOT NULL, "countryFocus" text array NOT NULL, "servicesOffered" "public"."advisor_profile_servicesoffered_enum" array NOT NULL, "pastProjects" text, "totalCapitalRaised" bigint, "caseStudies" text, "totalTeamMembers" integer, "totalYearsExperience" integer, "keyTeamMembers" text, "feeStructure" "public"."advisor_profile_feestructure_enum" array NOT NULL, CONSTRAINT "PK_b62ab061122e36488f889a6c365" PRIMARY KEY ("id"))`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "advisor_profile"`);
        await queryRunner.query(`DROP TYPE "public"."advisor_profile_feestructure_enum"`);
        await queryRunner.query(`DROP TYPE "public"."advisor_profile_servicesoffered_enum"`);
        await queryRunner.query(`DROP TYPE "public"."advisor_profile_roles_enum"`);
    }

}
