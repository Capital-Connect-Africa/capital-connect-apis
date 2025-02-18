import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvestorRepositoryTables1739476639907
  implements MigrationInterface
{
  name = 'CreateInvestorRepositoryTables1739476639907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."investors-repository_currency_enum" AS ENUM('USD', 'KES')`,
    );
    await queryRunner.query(
      `CREATE TABLE "investors-repository" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "countries" text array NOT NULL, "sectors" text array NOT NULL, "businessGrowthStages" text array NOT NULL, "investees" text array NOT NULL, "subSectors" text array NOT NULL, "website" character varying, "contactEmail" character varying, "contactName" character varying, "minFunding" numeric(20,2) NOT NULL, "maxFunding" numeric(20,2) NOT NULL, "currency" "public"."investors-repository_currency_enum" NOT NULL DEFAULT 'USD', "fundingVehicle" character varying, "useOfFunds" text array NOT NULL, "investmentStructures" text array NOT NULL, "esgFocusAreas" text array NOT NULL, "description" text, CONSTRAINT "UQ_15bb65ac7f9451c4e908cc94eef" UNIQUE ("name"), CONSTRAINT "PK_7ede71e9b550eab1e23236fc814" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "investors-respository-search-history" ("id" SERIAL NOT NULL, "sector" character varying, "country" character varying, "subSector" character varying, "targetAmount" numeric(20,2) DEFAULT '0', "useOfFunds" character varying NOT NULL, "matches" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f7f94420fb06cf382b95096ddec" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "investors-respository-search-history"`,
    );
    await queryRunner.query(`DROP TABLE "investors-repository"`);
    await queryRunner.query(
      `DROP TYPE "public"."investors-repository_currency_enum"`,
    );
  }
}
