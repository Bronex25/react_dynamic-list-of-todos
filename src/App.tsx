/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [option, setOption] = useState('all');
  const [query, setQuery] = useState('');
  const [activeLoader, setActiveLoader] = useState(true);

  useEffect(() => {
    getTodos()
      .then(todos => {
        setTodoList(todos);
        setActiveLoader(false);
      })
      // eslint-disable-next-line no-console
      .catch(error => console.error('Failed to fetch todos:', error));
  }, []);

  const filteredTodo = useMemo(() => {
    return todoList.filter(todo => {
      const titleToCheck = todo.title.toLowerCase().trim();
      const queryToCheck = query.trim().toLowerCase();
      const result = titleToCheck.includes(queryToCheck) || queryToCheck === '';

      switch (option) {
        case 'active':
          return !todo.completed && result;
        case 'completed':
          return todo.completed && result;
        default:
          return result;
      }
    });
  }, [option, query, todoList]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOption(event.target.value);
  };

  const handleShowTodo = (todo: Todo) => {
    setActiveTodo(todo);
  };

  const resetActiveTodo = () => {
    setActiveTodo(null);
  };

  const onResetInput = () => {
    setQuery('');
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                handleInputChange={handleInputChange}
                handleOptionChange={handleOptionChange}
                option={option}
                onResetInput={onResetInput}
                query={query}
              />
            </div>

            <div className="block">
              {activeLoader && <Loader />}
              <TodoList
                todos={filteredTodo}
                handleShowTodo={handleShowTodo}
                activeTodo={activeTodo}
              />
            </div>
          </div>
        </div>
      </div>

      {activeTodo !== null && (
        <TodoModal activeTodo={activeTodo} resetActiveTodo={resetActiveTodo} />
      )}
    </>
  );
};
