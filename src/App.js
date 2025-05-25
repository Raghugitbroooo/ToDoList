import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch all todos from backend
  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/todos');
      setTodos(res.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      await axios.post('http://localhost:5000/todos', { text });
      setText('');
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Delete a todo by id
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditText(todo.text);
  };

  // Save edited todo
  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, { text: editText });
      setEditId(null);
      setEditText('');
      fetchTodos();
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="app-container">
      <h1>📝 To-Do List (MERN)</h1>

      <div className="input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={addTodo} disabled={!text.trim()}>
          Add
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {editId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo._id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{todo.text}</span>
                <div>
                  <button onClick={() => startEdit(todo)}>✏️</button>
                  <button onClick={() => deleteTodo(todo._id)}>❌</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
