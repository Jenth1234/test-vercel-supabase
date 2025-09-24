import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'todos' })
export class Todo {
  [OptionalProps]?: 'description' | 'completed' | 'createdAt' | 'updatedAt';

  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({ columnType: 'text' })
  title!: string;

  @Property({ columnType: 'text', nullable: true })
  description?: string | null;

  @Property({ default: false })
  completed = false;

  @Property({ columnType: 'timestamptz', defaultRaw: 'now()', fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({
    columnType: 'timestamptz',
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
    fieldName: 'updated_at'
  })
  updatedAt: Date = new Date();
}
