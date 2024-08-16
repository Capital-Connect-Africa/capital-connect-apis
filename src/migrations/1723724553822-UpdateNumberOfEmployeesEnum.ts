import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNumberOfEmployeesEnum1723724553822 implements MigrationInterface {
    name = 'UpdateNumberOfEmployeesEnum1723724553822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."companies_numberofemployees_enum" RENAME TO "companies_numberofemployees_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."companies_numberofemployees_enum" AS ENUM('1-10 employees', '11-20 employees', '21-50 employees', '51-100 employees', '101-200 employees', '201-500 employees', '501-1,000 employees', '1,001-10,000 employees', '10,000+ employees')`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "numberOfEmployees" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "numberOfEmployees" TYPE "public"."companies_numberofemployees_enum" USING "numberOfEmployees"::"text"::"public"."companies_numberofemployees_enum"`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "numberOfEmployees" SET DEFAULT '1-10 employees'`);
        await queryRunner.query(`DROP TYPE "public"."companies_numberofemployees_enum_old"`);
        await queryRunner.query(`ALTER TABLE "countries" ALTER COLUMN "phoneCode" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "countries" ALTER COLUMN "phoneCode" SET DEFAULT ''`);
        await queryRunner.query(`CREATE TYPE "public"."companies_numberofemployees_enum_old" AS ENUM('1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '501-1000 employees', '1001-5000 employees', '5001-10000 employees', '10001+ employees')`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "numberOfEmployees" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "numberOfEmployees" TYPE "public"."companies_numberofemployees_enum_old" USING "numberOfEmployees"::"text"::"public"."companies_numberofemployees_enum_old"`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "numberOfEmployees" SET DEFAULT '1-10 employees'`);
        await queryRunner.query(`DROP TYPE "public"."companies_numberofemployees_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."companies_numberofemployees_enum_old" RENAME TO "companies_numberofemployees_enum"`);
    }

}
