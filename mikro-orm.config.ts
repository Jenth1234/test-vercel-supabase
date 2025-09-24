import { defineConfig } from '@mikro-orm/postgresql';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import { env, isProd } from './src/lib/env';
import { Todo } from './src/lib/entities/Todo';

export default defineConfig({
  clientUrl: env.DATABASE_URL,
  driverOptions: isProd
    ? {
        connection: {
          ssl: {
            rejectUnauthorized: false
          }
        }
      }
    : undefined,
  metadataProvider: ReflectMetadataProvider,
  entities: [Todo],
  entitiesTs: ['./src/lib/entities'],
  migrations: {
    path: './migrations',
    pathTs: './migrations',
    emit: 'ts',
    glob: '!(*.d).{js,ts}'
  },
  debug: !isProd
});
