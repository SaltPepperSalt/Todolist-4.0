import { ajax } from './ajax.js';
import { promiseAjax } from './ajax.js';
import { req } from './ajax.js';




// State
let todos = [];

// Dom
const $nav = document.querySelector('.nav');
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.querySelector('#ck-complete-all');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');
const $clearCompleted = document.querySelector('.clear-completed > .btn');
let mode = $nav.querySelector('.active').id;



// Function
const renderCallback = _todos => {
  todos = _todos;
  render();
};


const getTodos = () => {
  // ajax.get('/todos', _todos => {
  //   todos = _todos;
  //   todos = todos.sort((todo1, todo2) => todo2.id - todo1.id);
  //   render();
  // });

  // promiseAjax.get('/todos')
  // .then(_todos => {
  //   todos = _todos;
  //   todos = todos.sort((todo1, todo2) => todo2.id - todo1.id);
  //   render();
  // });;

  // req.get('/todos')
  //   .then(response => response.json())
  //   .then(_todos => todos = _todos)
  //   .then(() => todos = todos.sort((todo1, todo2) => todo2.id - todo1.id))
  //   .then(render);

  axios.get('/todos')
    .then(response => response.data)
    .then(_todos => todos = _todos)
    .then(() => todos = todos.sort((todo1, todo2) => todo2.id - todo1.id))
    .then(render);
};

const getId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

const addTodo = content => {
  //ajax.post('/todos', { id: getId(), content, completed: false }, renderCallback)

  // promiseAjax.post('/todos', { id: getId(), content, completed: false })
  // .then(renderCallback)

  // req.post('/todos', { id: getId(), content, completed: false })
  //   .then(response => response.json())
  //   .then(renderCallback);

  axios.post('/todos', { id: getId(), content, completed: false })
    .then(response => response.data)
    .then(renderCallback);
};

const removeTodo = id => {
  // ajax.delete(`/todos/${id}`, renderCallback);

  // promiseAjax.delete(`/todos/${id}`)
  // .then(renderCallback);

  // req.delete(`/todos/${id}`)
  //   .then(response => response.json())
  //   .then(renderCallback)

  axios.delete(`/todos/${id}`)
    .then(response => response.data)
    .then(renderCallback);
};

const toggleTodo = id => {
  const completed = !todos.find(todo => todo.id === +id).completed;
  // ajax.patch(`/todos/${id}`, { completed }, renderCallback)

  // promiseAjax.patch(`/todos/${id}`, { completed })
  // .then(renderCallback);

  // req.patch(`/todos/${id}`, { completed })
  //   .then(response => response.json())
  //   .then(renderCallback)

  axios.patch(`/todos/${id}`, { completed })
    .then(response => response.data)
    .then(renderCallback)
};

const completeAll = completed => {
  // ajax.patch(`/todos`, { completed }, renderCallback)

  // promiseAjax.patch(`/todos`, { completed })
  // .then(renderCallback);

  // req.patch(`/todos`, { completed })
  //   .then(response => response.json())
  //   .then(renderCallback)
  axios.patch(`/todos`, { completed })
    .then(response => response.data())
    .then(renderCallback)
};

const toggleCompleteall = checked => {
  $completeAll.checked = checked;
};

const clearCompleted = () => {
  // ajax.delete('/todos/completed', renderCallback);

  // promiseAjax.delete('/todos/completed')
  // .then(renderCallback);

  // req.delete('/todos/completed')
  //   .then(response => response.json())
  //   .then(renderCallback)

  axios.delete('/todos/completed')
    .then(response => response.data)
    .then(renderCallback)
};

const activeList = mode => ((mode === 'active') 
  ? todos.filter(todo => !todo.completed) 
  : (mode === 'completed') 
    ? todos.filter(todo => todo.completed) : todos);


const render = () => {
  let html = '';
  const cpTodos = activeList(mode);
  cpTodos.forEach(({ id, content, completed }) => {
    html += `<li id="${id}" class="todo-item">
    <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
    <label for="ck-${id}">${content}</label>
    <i class="remove-todo far fa-times-circle"></i>
  </li>`;
  });
  $todos.innerHTML = html;
  $completedTodos.textContent = todos.filter(todo => todo.completed).length;
  $activeTodos.textContent = todos.length - $completedTodos.textContent;
  toggleCompleteall(todos.length ? todos.every(todo => todo.completed) : false);
};





// Event Binding

window.onload = getTodos;

$nav.onclick = ({ target }) => {
  // [...$nav.children].forEach(child => child.classList.toggle('active', child === target));
  if (!target.matches('.nav > li:not(.active)')) return;
  $nav.querySelector('.active').classList.remove('active');
  target.classList.add('active');
  render();
};

$inputTodo.onkeyup = e => {
  if (e.keyCode !== 13) return;
  $inputTodo.value = $inputTodo.value.trim();
  if (!$inputTodo.value) return;
  addTodo($inputTodo.value);
  $inputTodo.value = '';
};

$todos.onclick = ({ target }) => {
  if (!target.matches('.remove-todo')) return;
  removeTodo(target.parentNode.id);
};

$todos.onchange = ({ target }) => {
  toggleTodo(target.parentNode.id);
};

$completeAll.onclick = ({ target }) => {
  completeAll(target.checked);
};

$clearCompleted.onclick = clearCompleted;