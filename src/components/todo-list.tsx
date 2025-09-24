'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  clearCompletedTodosAction,
  deleteTodoAction,
  markAllTodosCompletedAction,
  toggleTodoAction
} from '@/app/actions/todo-actions';

type TodoItem = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
};

type Props = {
  todos: TodoItem[];
};

export function TodoList({ todos }: Props) {
  const [isPending, startTransition] = useTransition();
  const [bulkError, setBulkError] = useState<{ source: 'clear' | 'complete'; message: string } | null>(
    null
  );
  const hasCompletedTodos = todos.some((todo) => todo.completed);
  const hasActiveTodos = todos.some((todo) => !todo.completed);

  useEffect(() => {
    if (bulkError?.source === 'clear' && hasCompletedTodos) {
      setBulkError(null);
    }
  }, [bulkError, hasCompletedTodos]);

  useEffect(() => {
    if (bulkError?.source === 'complete' && hasActiveTodos) {
      setBulkError(null);
    }
  }, [bulkError, hasActiveTodos]);

  if (todos.length === 0) {
    return <p className="empty-state">Create your first task to see it here.</p>;
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '0.5rem'
        }}
      >
        <button
          type="button"
          onClick={() => {
            setBulkError(null);
            startTransition(async () => {
              const result = await markAllTodosCompletedAction();
              if (!result.ok && result.error) {
                setBulkError({ source: 'complete', message: result.error });
              }
            });
          }}
          className="primary-button"
          disabled={isPending || !hasActiveTodos}
        >
          Mark all as completed
        </button>
        <button
          type="button"
          onClick={() => {
            setBulkError(null);
            startTransition(async () => {
              const result = await clearCompletedTodosAction();
              if (!result.ok && result.error) {
                setBulkError({ source: 'clear', message: result.error });
              }
            });
          }}
          className="primary-button"
          disabled={isPending || !hasCompletedTodos}
        >
          Clear completed tasks
        </button>
      </div>
      {bulkError ? (
        <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          {bulkError.message}
        </p>
      ) : null}
      <ul className="todo-list">
        {todos.map((todo) => {
          const titleClass = `todo-title${todo.completed ? ' todo-title--completed' : ''}`;

          return (
            <li key={todo.id} className="todo-item">
              <div className="todo-item__header">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    defaultChecked={todo.completed}
                    onChange={(event) => {
                      const nextCompleted = event.currentTarget.checked;
                      startTransition(async () => {
                        await toggleTodoAction(todo.id, nextCompleted);
                      });
                    }}
                    disabled={isPending}
                  />
                  <span className={titleClass}>{todo.title}</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    startTransition(async () => {
                      await deleteTodoAction(todo.id);
                    });
                  }}
                  className="danger-button"
                  disabled={isPending}
                >
                  Delete
                </button>
              </div>
              {todo.description ? <p className="todo-description">{todo.description}</p> : null}
              <p className="todo-meta">Added {new Date(todo.createdAt).toLocaleString()}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
