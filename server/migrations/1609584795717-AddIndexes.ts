import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIndexes1609584795717 implements MigrationInterface {
  name = 'AddIndexes1609584795717'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_b11a5e627c41d4dc3170f1d370" ON "notification" ("createdAt") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_1ced25315eb974b73391fb1c81" ON "notification" ("userId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_94f168faad896c0786646fa3d4" ON "token" ("userId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_72725a6b118ede500319a7da94" ON "user_comment_like" ("userId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7306a7964c2deec80aba41aa7f" ON "user_comment_like" ("commentId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d4a2527fbbba34e21b1079de42" ON "user_topic_like" ("userId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bee938ba73f54fe875fa83573d" ON "user_topic_like" ("topicId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d9ecea6879424139fcf247f2f6" ON "topic" ("createdAt") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d9ede173f1792aac9ea5098686" ON "topic" ("updatedAt") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5bc4974a5ec06dd10c348bdb5e" ON "topic" ("authorId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3edd3cdb7232a3e9220607eabb" ON "comment" ("createdAt") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b57a5333a16e092c662bd8ff5f" ON "comment" ("topicId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_276779da446413a0d79598d4fb" ON "comment" ("authorId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e3aebe2bd1c53467a07109be59" ON "comment" ("parentId") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_e3aebe2bd1c53467a07109be59"`)
    await queryRunner.query(`DROP INDEX "IDX_276779da446413a0d79598d4fb"`)
    await queryRunner.query(`DROP INDEX "IDX_b57a5333a16e092c662bd8ff5f"`)
    await queryRunner.query(`DROP INDEX "IDX_3edd3cdb7232a3e9220607eabb"`)
    await queryRunner.query(`DROP INDEX "IDX_5bc4974a5ec06dd10c348bdb5e"`)
    await queryRunner.query(`DROP INDEX "IDX_d9ede173f1792aac9ea5098686"`)
    await queryRunner.query(`DROP INDEX "IDX_d9ecea6879424139fcf247f2f6"`)
    await queryRunner.query(`DROP INDEX "IDX_bee938ba73f54fe875fa83573d"`)
    await queryRunner.query(`DROP INDEX "IDX_d4a2527fbbba34e21b1079de42"`)
    await queryRunner.query(`DROP INDEX "IDX_7306a7964c2deec80aba41aa7f"`)
    await queryRunner.query(`DROP INDEX "IDX_72725a6b118ede500319a7da94"`)
    await queryRunner.query(`DROP INDEX "IDX_94f168faad896c0786646fa3d4"`)
    await queryRunner.query(`DROP INDEX "IDX_1ced25315eb974b73391fb1c81"`)
    await queryRunner.query(`DROP INDEX "IDX_b11a5e627c41d4dc3170f1d370"`)
  }
}
