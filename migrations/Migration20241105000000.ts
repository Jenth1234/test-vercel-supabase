import { Migration } from '@mikro-orm/migrations';

export class Migration20241105000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`create extension if not exists "uuid-ossp";`);

    this.addSql(`
      create table if not exists "todos" (
        "id" uuid primary key default uuid_generate_v4(),
        "title" text not null,
        "description" text null,
        "completed" boolean not null default false,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now()
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "todos" cascade;');
  }
}
