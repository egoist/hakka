import { MigrationInterface, QueryRunner } from 'typeorm'

export class TopicHidden1617177540891 implements MigrationInterface {
  name = 'TopicHidden1617177540891'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "topic" ADD "hidden" boolean`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "hidden"`)
  }
}
