
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




// Function
const renderCallback = _todos => {
  todos = _todos;
  render();
};


const getTodos = async () => {
  const res = await axios.get('todos');
  todos = res.data;
  todos = todos.sort((todo1, todo2) => todo2.id - todo1.id);
  render();
};

const getId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

const addTodo = async content => {
  const res = await axios.post('/todos', { id: getId(), content, completed: false });
  todos = res.data;
  renderCallback(todos);
};

const removeTodo = async id => {
  const res = await axios.delete(`/todos/${id}`);
  todos = res.data;
  renderCallback(todos);
};

const toggleTodo = async id => {
  const completed = !todos.find(todo => todo.id === +id).completed;
  const res = await axios.patch(`/todos/${id}`, { completed })
  todos = res.data;
  renderCallback(todos);
};

const completeAll = async completed => {
  const res = await axios.patch('todos', { completed })
  todos = res.data;
  renderCallback(todos);
};

const toggleCompleteall = checked => {
  $completeAll.checked = checked;
};

const clearCompleted = async () => {
  const res = await axios.delete('todos/completed');
  todos = res.data;
  renderCallback(todos);
};

const activeList = mode => ((mode === 'active') 
  ? todos.filter(todo => !todo.completed) 
  : (mode === 'completed') 
    ? todos.filter(todo => todo.completed) : todos);


const render = () => {
  let html = '';
  const cpTodos = activeList($nav.querySelector('.active').id);
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