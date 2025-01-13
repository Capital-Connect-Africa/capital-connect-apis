import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeToUserVouchers1736490944089 implements MigrationInterface {
    name = 'AddCascadeToUserVouchers1736490944089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_vouchers" DROP CONSTRAINT "FK_133943cc01869b20c2064e9f79b"`);
        await queryRunner.query(`ALTER TABLE "user_vouchers" ADD CONSTRAINT "FK_133943cc01869b20c2064e9f79b" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_vouchers" DROP CONSTRAINT "FK_133943cc01869b20c2064e9f79b"`);
        await queryRunner.query(`ALTER TABLE "user_vouchers" ADD CONSTRAINT "FK_133943cc01869b20c2064e9f79b" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
