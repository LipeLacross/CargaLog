import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration inicial - Criação das tabelas principais
 * Tabelas: usuarios, treinos, analises
 */
export class InitialSchema1709558400000 implements MigrationInterface {
  name = 'InitialSchema1709558400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela usuarios
    await queryRunner.query(`
      CREATE TABLE "usuarios" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nome" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "senha" character varying(255) NOT NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        "atualizado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_usuarios_email" UNIQUE ("email"),
        CONSTRAINT "PK_usuarios" PRIMARY KEY ("id")
      )
    `);

    // Criar tabela treinos
    await queryRunner.query(`
      CREATE TABLE "treinos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "usuario_id" uuid NOT NULL,
        "exercicio_nome" character varying(255) NOT NULL,
        "carga" decimal(10,2) NOT NULL,
        "repeticoes" integer NOT NULL,
        "series" integer DEFAULT 1,
        "observacoes" text,
        "data" date NOT NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_treinos" PRIMARY KEY ("id")
      )
    `);

    // Criar índices na tabela treinos
    await queryRunner.query(`
      CREATE INDEX "IDX_treinos_usuario_exercicio" 
      ON "treinos" ("usuario_id", "exercicio_nome")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_treinos_usuario_data" 
      ON "treinos" ("usuario_id", "data")
    `);

    // Criar foreign key de treinos para usuarios
    await queryRunner.query(`
      ALTER TABLE "treinos" 
      ADD CONSTRAINT "FK_treinos_usuario" 
      FOREIGN KEY ("usuario_id") 
      REFERENCES "usuarios"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);

    // Criar tabela analises
    await queryRunner.query(`
      CREATE TABLE "analises" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "usuario_id" uuid NOT NULL,
        "exercicio_nome" character varying(255) NOT NULL,
        "periodo_inicio" date NOT NULL,
        "periodo_fim" date NOT NULL,
        "carga_maxima" decimal(10,2) NOT NULL,
        "carga_media" decimal(10,2) NOT NULL,
        "total_treinos" integer NOT NULL,
        "progresso" decimal(5,2) NOT NULL,
        "criado_em" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_analises" PRIMARY KEY ("id")
      )
    `);

    // Criar foreign key de analises para usuarios
    await queryRunner.query(`
      ALTER TABLE "analises" 
      ADD CONSTRAINT "FK_analises_usuario" 
      FOREIGN KEY ("usuario_id") 
      REFERENCES "usuarios"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign keys
    await queryRunner.query(
      `ALTER TABLE "analises" DROP CONSTRAINT "FK_analises_usuario"`,
    );
    await queryRunner.query(
      `ALTER TABLE "treinos" DROP CONSTRAINT "FK_treinos_usuario"`,
    );

    // Remover índices
    await queryRunner.query(`DROP INDEX "IDX_treinos_usuario_data"`);
    await queryRunner.query(`DROP INDEX "IDX_treinos_usuario_exercicio"`);

    // Remover tabelas
    await queryRunner.query(`DROP TABLE "analises"`);
    await queryRunner.query(`DROP TABLE "treinos"`);
    await queryRunner.query(`DROP TABLE "usuarios"`);
  }
}
