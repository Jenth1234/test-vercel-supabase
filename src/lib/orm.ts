import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfig from '../../mikro-orm.config';

const globalForOrm = globalThis as unknown as {
  _orm?: MikroORM;
};

export async function getOrm(): Promise<MikroORM> {
  if (!globalForOrm._orm) {
    globalForOrm._orm = await MikroORM.init(mikroOrmConfig);
  }

  return globalForOrm._orm;
}

export async function getEntityManager() {
  const orm = await getOrm();
  return orm.em.fork();
}

export async function closeOrm() {
  if (globalForOrm._orm) {
    await globalForOrm._orm.close(true);
    globalForOrm._orm = undefined;
  }
}
