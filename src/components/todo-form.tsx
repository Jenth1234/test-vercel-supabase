'use client';

import { useActionState } from 'react';
import { createTodoAction } from '@/app/actions/todo-actions';

const initialState = {
  ok: true,
  error: undefined as string | undefined
};

export function TodoForm() {
  const [state, formAction] = useActionState(createTodoAction, initialState);

  return (
    <form action={formAction} className="card form-card">
      <div>
        <h2 className="todo-title">Create a task</h2>
        <p className="todo-meta" style={{ marginTop: '0.4rem' }}>
          Saved tasks are stored in Supabase PostgreSQL through Mikro-ORM.
        </p>
      </div>
      <label className="field">
        Title
        <input
          name="title"
          placeholder="Build Supabase + Next.js app"
          className="text-input"
          required
          maxLength={140}
        />
      </label>
      <label className="field">
        Description
        <textarea
          name="description"
          placeholder="Optional details"
          className="text-input"
          maxLength={500}
        />
      </label>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="primary-button">
          Save task
        </button>
      </div>
      {!state.ok && state.error ? (
        <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{state.error}</p>
      ) : null}
    </form>
  );
}
