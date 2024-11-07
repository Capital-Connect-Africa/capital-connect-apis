import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVoucherUsers1731014620605 implements MigrationInterface {
    name = 'AddVoucherUsers1731014620605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_vouchers" ("id" SERIAL NOT NULL, "usedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "voucherId" integer, CONSTRAINT "UQ_3194b155a5885f3267098bb4f88" UNIQUE ("userId", "voucherId"), CONSTRAINT "PK_66534a148ba312dd88e48ee6072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_vouchers" ADD CONSTRAINT "FK_1d664edcc508b45021dadaad2ee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_vouchers" ADD CONSTRAINT "FK_133943cc01869b20c2064e9f79b" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
       }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_vouchers" DROP CONSTRAINT "FK_133943cc01869b20c2064e9f79b"`);
        await queryRunner.query(`ALTER TABLE "user_vouchers" DROP CONSTRAINT "FK_1d664edcc508b45021dadaad2ee"`);
        await queryRunner.query(`DROP TABLE "user_vouchers"`);
       
    }

}
