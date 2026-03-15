import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditLog1709700000000 implements MigrationInterface {
  name = 'AuditLog1709700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "logs_auditoria" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "usuario_id" uuid,
        "acao" character varying(100) NOT NULL,
        "entidade" character varying(50),
        "entidade_id" uuid,
        "dados_anteriores" jsonb,
        "dados_novos" jsonb,
        "ip" character varying(45),
        "user_agent" text,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_logs_auditoria" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_logs_auditoria_usuario" 
      ON "logs_auditoria" ("usuario_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_logs_auditoria_entidade" 
      ON "logs_auditoria" ("entidade", "entidade_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_logs_auditoria_criado" 
      ON "logs_auditoria" ("criado_em")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_logs_auditoria_acao" 
      ON "logs_auditoria" ("acao")
    `);

    await queryRunner.query(`
      ALTER TABLE "logs_auditoria" 
      ADD CONSTRAINT "FK_logs_auditoria_usuario" 
      FOREIGN KEY ("usuario_id") 
      REFERENCES "usuarios"("id") 
      ON DELETE SET NULL 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "logs_auditoria" DROP CONSTRAINT "FK_logs_auditoria_usuario"`,
    );

    await queryRunner.query(`DROP INDEX "IDX_logs_auditoria_acao"`);
    await queryRunner.query(`DROP INDEX "IDX_logs_auditoria_criado"`);
    await queryRunner.query(`DROP INDEX "IDX_logs_auditoria_entidade"`);
    await queryRunner.query(`DROP INDEX "IDX_logs_auditoria_usuario"`);

    await queryRunner.query(`DROP TABLE "logs_auditoria"`);
  }
}
