import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Todo } from '@/lib/entities/Todo';
import { getEntityManager } from '@/lib/orm';

const createTodoBody = z.object({
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().max(500).nullish()
});

const toJSON = (todo: Todo) => ({
  id: todo.id,
  title: todo.title,
  description: todo.description ?? null,
  completed: todo.completed,
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString()
});

export async function GET() {
  const em = await getEntityManager();
  const todos = await em.find(Todo, {}, { orderBy: { createdAt: 'desc' } });

  return NextResponse.json({ todos: todos.map(toJSON) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createTodoBody.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request payload', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const em = await getEntityManager();
  const todo = em.create(Todo, {
    title: parsed.data.title,
    description: parsed.data.description ?? null
  });

  await em.persistAndFlush(todo);

  return NextResponse.json({ todo: toJSON(todo) }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing todo id' }, { status: 400 });
  }

  const em = await getEntityManager();
  const todo = await em.findOne(Todo, { id });

  if (!todo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  await em.removeAndFlush(todo);

  return new NextResponse(null, { status: 204 });
}
