import React, { useState, useEffect, useRef, useContext } from 'react';
import '../style/Todo.css';
import axios from 'axios';
import { AuthContext } from '../globalState';
import { Redirect } from 'react-router-dom';

function Form() {
  const [todos, setTodos] = useState([]);
  const ref = useRef(null);
  const { user, loading } = useContext(AuthContext);
  const [todo, setTodo] = useState('');
  const [edit, setEdit] = useState({ id: '', edit: false });

  useEffect(() => {
    ref.current.focus();
  }, [todos]);

  useEffect(() => {
    if (user) {
      setTodos(user.todos);
    }
  }, [user]);

  if (!loading && user == null) {
    alert('Please Login');
    return <Redirect to='/' />;
  }

  const changeHandler = e => {
    setTodo(e.target.value);
  };

  const addTodo = e => {
    e.preventDefault();
    if (ref.current.value) {
      const token = localStorage.getItem('token');
      const option = {
        headers: {
          'x-auth-token': token,
        },
      };
      const body = {
        todo: todo,
      };
      axios.post('http://localhost:3001/api/todo', body, option).then(res => {
        setTodos(todos.concat(res.data.todo));
        setTodo('');
      });
    }
  };

  const editTask = e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const option = {
      headers: {
        'x-auth-token': token,
      },
    };
    const body = {
      todo: todo,
    };
    axios
      .put(`http://localhost:3001/api/todo/${edit.id}`, body, option)
      .then(res => {
        let newTodos = [...todos];
        newTodos.map(t => {
          if (t._id === edit.id) {
            t.task = todo;
          }
        });

        setTodos(newTodos);
        setTodo('');
        setEdit({ id: '', edit: false });
      })
      .catch(err => alert('Counld not Edit todo'));
  };

  const removeTask = id => {
    const token = localStorage.getItem('token');
    const option = {
      headers: {
        'x-auth-token': token,
      },
    };

    axios
      .delete(`http://localhost:3001/api/todo/${id}`, option)
      .then(res => {
        let existingTasks = todos.filter(todo => todo._id !== id);
        setTodos(existingTasks);
        setTodo('');
      })
      .catch(err => alert('Could not delete todo'));
  };

  const completeHandler = id => {
    setTodos(
      todos.map(item => {
        if (item._id === id) {
          ref.current.value = '';
          setTimeout(() => {
            removeTask(item._id);
          }, 1000);
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      })
    );
  };

  return (
    <div>
      <header>
        <h1>Your Todo List</h1>
      </header>
      <form>
        <input
          type='text'
          className='todo-input'
          ref={ref}
          value={todo}
          onChange={e => setTodo(e.target.value)}
          placeholder='Add a Todo'
        />
        {edit.edit ? (
          <button className='todo-button' onClick={editTask}>
            Edit
          </button>
        ) : (
          <button className='todo-button' onClick={addTodo}>
            <i className='fas fa-plus-square'></i>
          </button>
        )}{' '}
        <div className='select'></div>
      </form>
      {todos.map(aTodo => {
        const { task, _id: id } = aTodo;
        return (
          <div className='todo' key={id}>
            <li className={`todo-item ${aTodo.completed ? 'completed' : ''}`}>
              {task}
            </li>
            <button
              className='trash-btn'
              onClick={() => {
                removeTask(id);
              }}
            >
              <i className='fas fa-trash'></i>
            </button>
            <button
              className='edit-btn'
              onClick={() => {
                setEdit(e => ({ ...e, id: id, edit: true }));
                setTodo(task);
              }}
            >
              <i className='fas fa-edit'></i>
            </button>
            <button
              className='complete-btn'
              onClick={() => {
                completeHandler(id);
              }}
            >
              <i className='fas fa-check'></i>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Form;
