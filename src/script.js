const FORM_SELECTOR = '#todoForm'
const UL_SELECTOR = '#todoList'
const DONE_CLASS = 'done'
const DELETE_BTN_CLASS = 'deleteBtn'
const TODO_ITEM_CLASS = 'todoItem'
const URL = 'https://mock-api-5678.nw.r.appspot.com/todos/'
const URL_OTHER = 'https://mock-api-5678.nw.r.appspot.com/todos/1'

const form = document.querySelector(FORM_SELECTOR)
const ul = document.querySelector(UL_SELECTOR)

form.addEventListener('submit', onFormSubmit)
ul.addEventListener('click', onUlClick)

getTodoList()
  .then((list) => {
    renderTodoList(list)
  })
  .catch(e => showError(e.message))

function onFormSubmit (e) {
  e.preventDefault()

  const formElements = form.elements
  const todo = getFormData(formElements)

  if (!isTodoValid(todo)) {
    showError('Поле сообщение не должно быть пустым')
    return
  }

  createTodo(todo)
    .then((newTodo) => {
      renderTodo(newTodo)
      clearFormData(formElements)
    })
    .catch(e => showError(e.message))
}

function onUlClick (e) {
  const todoItemEl = getTodoItemEl(e.target)
  const id = todoItemEl.dataset.id

  if (todoItemEl) {
    if (isDeleteBtn(e.target)) {
      deleteTodo(id)
        .then(() => deleteTodoEl(todoItemEl))
        .catch(e => showError(e.message))
    } 

    else {
      const isDone = todoItemEl.classList.contains(DONE_CLASS)
      const newDone = !isDone;
      updateTodoStatus(id, newDone)
        .then(() => {
          toggleDone(todoItemEl)
        })
        .catch((e) => showError(e.message))
    }
  }
}

function isTodoValid (todo) { // boolean
  return todo.message !== ''
}

function renderTodoList (list) {
  const html = list.map(generateTodoHtml).join('')

  ul.innerHTML = html
}

function renderTodo (todo) {
  const html = generateTodoHtml(todo)

  ul.insertAdjacentHTML('beforeend', html)
}

function generateTodoHtml (todo) {
  const done = todo.done ? ` ${DONE_CLASS}` : ''

  return `
    <li class="todoItem${done}" data-id="${todo.id}">
      ${todo.title}
      <button class="${DELETE_BTN_CLASS}"><span>[Delete]</span></button>
    </li>
  `
}

function getTodoItemEl (el) {
  return el.closest(`.${TODO_ITEM_CLASS}`)
}

function isDeleteBtn (el) {
  return el.closest(`.${DELETE_BTN_CLASS}`)
}

function deleteTodoEl (el) {
  return el.remove()
}

function toggleDone (el) {
  return el.classList.toggle(DONE_CLASS)
}

function getTodoList () {
  return fetch(URL)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .catch((error) => {
      throw new Error(`Can not fitch todo list: ${error.message}`);
    })
}

function createTodo (todo) {
  return fetch(URL, {
    method: 'POST',
    body: JSON.stringify(todo), // JSON.parse
    headers: {
      'Content-type': 'application/json',
    }
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .catch((error) => {
      throw new Error(`Can not create todo: ${error.message}`);
    })
}

function getTodoById(id) {
  return fetch(`${URL_OTHER}${id}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(`${response.status} ${response.statusText}`)
    })
    .catch((error) => {
      throw new Error(`Can not fetch todo: ${error.message}`)
    })
}

getTodoById(1)
  .then((todo) => {
    renderTodo(todo)
  })
  .catch((e) => showError(e.message))

function updateTodoStatus(id, done) {
  const updateData = {
    done: done
  }
  return fetch(`${URL_OTHER}${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
    headers: {
      'Content-type': 'application/json',
    }
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    })
    .catch((error) => {
      throw new Error(`Can not update todo status: ${error.message}`);
    });
}

function deleteTodo (id) {
  return fetch(`${URL}${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }

      throw new Error(`${response.status} ${response.statusText}`);
    })
    .catch((error) => {
      throw new Error(`Can not delete todo: ${error.message}`);
    })
}

