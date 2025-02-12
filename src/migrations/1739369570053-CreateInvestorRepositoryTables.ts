import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvestorRepositoryTables1739369570053
  implements MigrationInterface
{
  name = 'CreateInvestorRepositoryTables1739369570053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "investor-repositories-investees" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" "public"."investor-repositories-investees_type_enum" NOT NULL DEFAULT 'out-bound', CONSTRAINT "UQ_7541eb53b50f2cfb29a41120d69" UNIQUE ("name"), CONSTRAINT "PK_81c519e494952a395dbdda45c52" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "investors-repository" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "countries" text array NOT NULL, "businessGrowthStages" text array NOT NULL, "website" character varying, "minFunding" numeric(20,2) NOT NULL, "maxFunding" numeric(20,2) NOT NULL, "currency" "public"."investors-repository_currency_enum" NOT NULL DEFAULT 'USD', "fundingVehicle" character varying, "esgFocusAreas" text array NOT NULL, "description" text, "typeId" integer, CONSTRAINT "UQ_15bb65ac7f9451c4e908cc94eef" UNIQUE ("name"), CONSTRAINT "PK_7ede71e9b550eab1e23236fc814" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "investors-repository_sectors_sectors" ("investorsRepositoryId" integer NOT NULL, "sectorsId" integer NOT NULL, CONSTRAINT "PK_5732d91f648df0dcc74d6c1ce8b" PRIMARY KEY ("investorsRepositoryId", "sectorsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_78f50449e4b26942640da40851" ON "investors-repository_sectors_sectors" ("investorsRepositoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f77d85122c15fc1464ecb1fc7f" ON "investors-repository_sectors_sectors" ("sectorsId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "investors-repository_sub_sectors_subsectors" ("investorsRepositoryId" integer NOT NULL, "subsectorsId" integer NOT NULL, CONSTRAINT "PK_67472db3ab79ffa29967d634aaa" PRIMARY KEY ("investorsRepositoryId", "subsectorsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_63b1abe5ba7054daa031355f77" ON "investors-repository_sub_sectors_subsectors" ("investorsRepositoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_73c711d909afa63fd6ec75bd9c" ON "investors-repository_sub_sectors_subsectors" ("subsectorsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "investors-repository" ADD CONSTRAINT "FK_d39c217fb7d73d2dac3c1fbda6f" FOREIGN KEY ("typeId") REFERENCES "investor-types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "investors-repository_sectors_sectors" ADD CONSTRAINT "FK_78f50449e4b26942640da408518" FOREIGN KEY ("investorsRepositoryId") REFERENCES "investors-repository"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "investors-repository_sectors_sectors" ADD CONSTRAINT "FK_f77d85122c15fc1464ecb1fc7fb" FOREIGN KEY ("sectorsId") REFERENCES "sectors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "investors-repository_sub_sectors_subsectors" ADD CONSTRAINT "FK_63b1abe5ba7054daa031355f777" FOREIGN KEY ("investorsRepositoryId") REFERENCES "investors-repository"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "investors-repository_sub_sectors_subsectors" ADD CONSTRAINT "FK_73c711d909afa63fd6ec75bd9ca" FOREIGN KEY ("subsectorsId") REFERENCES "subsectors"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investors-repository_sub_sectors_subsectors" DROP CONSTRAINT "FK_73c711d909afa63fd6ec75bd9ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "investors-repository_sub_sectors_subsectors" DROP CONSTRAINT "FK_63b1abe5ba7054daa031355f777"`,
    );
    await queryRunner.query(
      `ALTER TABLE "investors-repository_sectors_sectors" DROP CONSTRAINT "FK_f77d85122c15fc1464ecb1fc7fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "investors-repository_sectors_sectors" DROP CONSTRAINT "FK_78f50449e4b26942640da408518"`,
    );
    await queryRunner.query(
      `ALTER TABLE "investors-repository" DROP CONSTRAINT "FK_d39c217fb7d73d2dac3c1fbda6f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_73c711d909afa63fd6ec75bd9c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_63b1abe5ba7054daa031355f77"`,
    );
    await queryRunner.query(
      `DROP TABLE "investors-repository_sub_sectors_subsectors"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f77d85122c15fc1464ecb1fc7f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_78f50449e4b26942640da40851"`,
    );
    await queryRunner.query(
      `DROP TABLE "investors-repository_sectors_sectors"`,
    );
    await queryRunner.query(`DROP TABLE "investors-repository"`);
    await queryRunner.query(`DROP TABLE "investor-repositories-investees"`);
  }
}
