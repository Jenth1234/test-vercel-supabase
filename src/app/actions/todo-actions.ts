'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Todo } from '@/lib/entities/Todo';
import { getEntityManager } from '@/lib/orm';

const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(140),
  description: z
    .string()
    .trim()
    .max(500, 'Description is limited to 500 characters')
    .optional()
});

type ActionState = {
  ok: boolean;
  error?: string;
};

export async function createTodoAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const parsed = createTodoSchema.parse({
      title: formData.get('title'),
      description: formData.get('description')
    });

    const em = await getEntityManager();
    const todo = em.create(Todo, {
      title: parsed.title,
      description: parsed.description || null
    });

    await em.persistAndFlush(todo);
    revalidatePath('/');

    return { ok: true };
  } catch (error) {
    console.error('Failed to create todo', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong. Please try again later.';
    return { ok: false, error: message };
  }
}

export async function toggleTodoAction(id: string, completed: boolean) {
  const em = await getEntityManager();
  const todo = await em.findOne(Todo, { id });

  if (!todo) {
    return { ok: false, error: 'Todo not found' } as ActionState;
  }

  todo.completed = completed;
  await em.persistAndFlush(todo);
  revalidatePath('/');

  return { ok: true } as ActionState;
}

export async function deleteTodoAction(id: string) {
  const em = await getEntityManager();
  const todo = await em.findOne(Todo, { id });

  if (!todo) {
    return { ok: false, error: 'Todo not found' } as ActionState;
  }

  await em.removeAndFlush(todo);
  revalidatePath('/');

  return { ok: true } as ActionState;
}

export async function clearCompletedTodosAction() {
  try {
    const em = await getEntityManager();
    const deletedCount = await em.nativeDelete(Todo, { completed: true });

    if (deletedCount === 0) {
      return { ok: false, error: 'No completed tasks to clear' } as ActionState;
    }

    revalidatePath('/');
    return { ok: true } as ActionState;
  } catch (error) {
    console.error('Failed to clear completed todos', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong. Please try again later.';
    return { ok: false, error: message } as ActionState;
  }
}

export async function markAllTodosCompletedAction() {
  try {
    const em = await getEntityManager();
    const updatedCount = await em.nativeUpdate(Todo, { completed: false }, { completed: true });

    if (updatedCount === 0) {
      return { ok: false, error: 'No active tasks to mark complete' } as ActionState;
    }

    revalidatePath('/');
    return { ok: true } as ActionState;
  } catch (error) {
    console.error('Failed to mark all todos completed', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Something went wrong. Please try again later.';
    return { ok: false, error: message } as ActionState;
  }
}
