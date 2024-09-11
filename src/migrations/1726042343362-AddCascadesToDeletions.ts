import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadesToDeletions1726042343362 implements MigrationInterface {
    name = 'AddCascadesToDeletions1726042343362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_6d64e8c7527a9e4af83cc66cbf7"`);
        await queryRunner.query(`ALTER TABLE "connection_requests" DROP CONSTRAINT "FK_802e07257e70f60d02331ed40b8"`);
        await queryRunner.query(`ALTER TABLE "connection_requests" DROP CONSTRAINT "FK_9e90441e1e716ddb9c8f6169a0f"`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" DROP CONSTRAINT "FK_dd748db8add7070b99bf789a069"`);
        await queryRunner.query(`ALTER TABLE "special_criteria" DROP CONSTRAINT "FK_43bc88fb584f6666b5fb1e46611"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_7bd626272858ef6464aa2579094"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`);
        await queryRunner.query(`ALTER TABLE "mobile-numbers" DROP CONSTRAINT "FK_cc40167d45430aad0a8576b8bfd"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06"`);
        await queryRunner.query(`ALTER TABLE "match_makings" DROP CONSTRAINT "FK_cebf46a510648258e626817ad95"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b261fc54cc414ed7d328f31c0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a857e7976ba7d94b215425fa7"`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "investmentStructure" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "useOfFunds" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "esgFocusAreas" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "fundsNeeded" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ALTER COLUMN "isApproved" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_2b261fc54cc414ed7d328f31c0" ON "special_criteria_questions" ("specialCriteriaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6a857e7976ba7d94b215425fa7" ON "special_criteria_questions" ("questionsId") `);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_6d64e8c7527a9e4af83cc66cbf7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ADD CONSTRAINT "FK_9e90441e1e716ddb9c8f6169a0f" FOREIGN KEY ("investorProfileId") REFERENCES "investor_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ADD CONSTRAINT "FK_802e07257e70f60d02331ed40b8" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" ADD CONSTRAINT "FK_dd748db8add7070b99bf789a069" FOREIGN KEY ("investorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "special_criteria" ADD CONSTRAINT "FK_43bc88fb584f6666b5fb1e46611" FOREIGN KEY ("investorProfileId") REFERENCES "investor_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_7bd626272858ef6464aa2579094" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mobile-numbers" ADD CONSTRAINT "FK_cc40167d45430aad0a8576b8bfd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_makings" ADD CONSTRAINT "FK_cebf46a510648258e626817ad95" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06" FOREIGN KEY ("specialCriteriaId") REFERENCES "special_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b"`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" DROP CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06"`);
        await queryRunner.query(`ALTER TABLE "match_makings" DROP CONSTRAINT "FK_cebf46a510648258e626817ad95"`);
        await queryRunner.query(`ALTER TABLE "mobile-numbers" DROP CONSTRAINT "FK_cc40167d45430aad0a8576b8bfd"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_7bd626272858ef6464aa2579094"`);
        await queryRunner.query(`ALTER TABLE "special_criteria" DROP CONSTRAINT "FK_43bc88fb584f6666b5fb1e46611"`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" DROP CONSTRAINT "FK_dd748db8add7070b99bf789a069"`);
        await queryRunner.query(`ALTER TABLE "connection_requests" DROP CONSTRAINT "FK_802e07257e70f60d02331ed40b8"`);
        await queryRunner.query(`ALTER TABLE "connection_requests" DROP CONSTRAINT "FK_9e90441e1e716ddb9c8f6169a0f"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_6d64e8c7527a9e4af83cc66cbf7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a857e7976ba7d94b215425fa7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b261fc54cc414ed7d328f31c0"`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ALTER COLUMN "isApproved" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "fundsNeeded" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "esgFocusAreas" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "useOfFunds" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "investmentStructure" SET DEFAULT ''`);
        await queryRunner.query(`CREATE INDEX "IDX_6a857e7976ba7d94b215425fa7" ON "special_criteria_questions" ("questionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b261fc54cc414ed7d328f31c0" ON "special_criteria_questions" ("specialCriteriaId") `);
        await queryRunner.query(`ALTER TABLE "match_makings" ADD CONSTRAINT "FK_cebf46a510648258e626817ad95" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_2b261fc54cc414ed7d328f31c06" FOREIGN KEY ("specialCriteriaId") REFERENCES "special_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "special_criteria_questions" ADD CONSTRAINT "FK_6a857e7976ba7d94b215425fa7b" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mobile-numbers" ADD CONSTRAINT "FK_cc40167d45430aad0a8576b8bfd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_7bd626272858ef6464aa2579094" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "special_criteria" ADD CONSTRAINT "FK_43bc88fb584f6666b5fb1e46611" FOREIGN KEY ("investorProfileId") REFERENCES "investor_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investor_profiles" ADD CONSTRAINT "FK_dd748db8add7070b99bf789a069" FOREIGN KEY ("investorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ADD CONSTRAINT "FK_9e90441e1e716ddb9c8f6169a0f" FOREIGN KEY ("investorProfileId") REFERENCES "investor_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connection_requests" ADD CONSTRAINT "FK_802e07257e70f60d02331ed40b8" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_6d64e8c7527a9e4af83cc66cbf7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
