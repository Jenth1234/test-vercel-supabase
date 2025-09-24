import Link from 'next/link';
import { TodoForm } from '@/components/todo-form';
import { TodoList } from '@/components/todo-list';
import { Todo } from '@/lib/entities/Todo';
import { getEntityManager } from '@/lib/orm';

const toSerializable = (todo: Todo) => ({
  id: todo.id,
  title: todo.title,
  description: todo.description ?? null,
  completed: todo.completed,
  createdAt: todo.createdAt.toISOString()
});

export default async function HomePage() {
  const em = await getEntityManager();
  const todos = await em.find(Todo, {}, { orderBy: { createdAt: 'desc' } });

  return (
    <div className="page">
      <header className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Supabase + Mikro-ORM Demo</h1>
          <p className="todo-meta" style={{ marginTop: '0.75rem' }}>
            This starter shows how to combine Supabase auth, PostgreSQL, and Mikro-ORM inside a Next.js 15
            app deployable on Vercel.
          </p>
        </div>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link href="https://supabase.com/docs" target="_blank" rel="noreferrer" className="primary-button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Supabase docs
          </Link>
          <Link
            href="https://mikro-orm.io/docs"
            target="_blank"
            rel="noreferrer"
            className="danger-button"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Mikro-ORM docs
          </Link>
          <Link
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
            className="primary-button"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Next.js docs
          </Link>
        </nav>
      </header>
      <TodoForm />
      <TodoList todos={todos.map(toSerializable)} />
    </div>
  );
}
