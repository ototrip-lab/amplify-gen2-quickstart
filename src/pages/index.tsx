import { signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { useEffect, useState } from 'react';

import { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

export default function HomePage() {
  const [todos, setTodos] = useState<Schema['Todo']['type'][]>([]);

  async function listTodos() {
    // fetch all todos
    const { data } = await client.models.Todo.list();
    setTodos(data);
  }

  useEffect(() => {
    listTodos();
  }, []);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe(({ items }) =>
      setTodos([...items])
    );

    return () => sub.unsubscribe();
  }, []);

  return (
    <main>
      <h1>Hello, Amplify 👋</h1>

      <button
        onClick={async () => {
          handleSignOut();
        }}
      >
        サインアウト
      </button>

      <button
        onClick={async () => {
          // create a new Todo with the following attributes
          const { errors, data: newTodo } = await client.models.Todo.create({
            // prompt the user to enter the title
            content: window.prompt('title'),
            // done: false,
            // priority: 'medium',
          });
          console.log(errors, newTodo);
        }}
      >
        Create
      </button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </main>
  );
}
