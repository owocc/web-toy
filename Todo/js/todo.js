// 为 window 设置加载后执行,让 js 文件执行时 DOM 已经渲染完毕
window.addEventListener('load', () => {
  gsap.registerPlugin(Draggable)

  const TODO_SAVE_NAME = 'todoList'
  let _TODOLIST = []
  const todoList = () => _TODOLIST
  const setTodoList = (newList) => {
    console.log(newList)
    _TODOLIST = [...newList]
    saveTolocalStorage()
    syncToDom()
  }

  //   一些工具方法
  function isEmpty(str) {
    return !str || str === '' || str === null
  }
  const saveTolocalStorage = () => {
    const todoListStr = JSON.stringify(todoList())
    localStorage.setItem(TODO_SAVE_NAME, todoListStr)
  }
  const getToLocalStorage = () => {
    const todoListStr = localStorage.getItem(TODO_SAVE_NAME)
    setTodoList(JSON.parse(todoListStr))
  }

  const resetTodoList = () => {
    const baseTodo = [
      {
        task: '点击右侧的删除按钮删除这个Todo',
        id: 1,
      },
      {
        task: '点击右侧的编辑按钮来编辑下Todo',
        id: 2,
      },
    ]
    setTodoList(baseTodo)
  }

  // 从本地缓存加载Todo,或者重置为初始值
  const loadTodoList = () => {
    const localTodo = localStorage.getItem(TODO_SAVE_NAME)
    if (isEmpty(localTodo)) {
      resetTodoList()
    } else {
      getToLocalStorage()
    }
  }

  const addTodoItem = (task) => {
    const todo = { task, id: Math.floor(Math.random() * 1000000000) }
    const newTodoList = [...todoList(), todo]
    setTodoList(newTodoList)
  }
  const removeTodoItem = (id) => {
    const newTodoList = todoList().filter((todo) => todo.id !== id)
    setTodoList(newTodoList)
  }

  const EditIcon = () => {
    return `<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    class="icon"
    viewBox="0 0 16 16"
  >
    <path
      d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
    />
  </svg>`
  }

  const DeleteIcon = () => {
    return `<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    class="icon"
    viewBox="0 0 16 16"
  >
    <path
      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
    />
    <path
      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
    />
  </svg>`
  }

  const generateTodoDom = (todo) => {
    const li = document.createElement('li')
    li.className = 'todo-item'
    li.setAttribute('data-id', todo.id)
    const mainContent = document.createElement('div')
    mainContent.textContent = todo.task

    // 放置操作按钮的 div
    const itemOptions = document.createElement('div')
    itemOptions.className = 'item-options'

    const addButton = document.createElement('button')
    addButton.innerHTML = EditIcon()

    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = DeleteIcon()
    deleteButton.addEventListener('click', (e) => {
      removeTodoItem(todo.id)
    })

    itemOptions.appendChild(addButton)
    itemOptions.appendChild(deleteButton)
    // 组合所有元素
    li.appendChild(mainContent)
    li.appendChild(itemOptions)
    return li
  }

  //   将改变同步渲染到 DOM
  const syncToDom = () => {
    const DOMDIV = document.querySelector('#todoList')
    const tempContainer = document.createElement('div')
    // todoList().map((todo) => tempContainer.appendChild(generateTodoDom(todo)))
    DOMDIV.innerHTML = null
    todoList().map((todo) => DOMDIV.appendChild(generateTodoDom(todo)))
  }

  const eventListener = () => {
    //   绑定点击事件
    const addForm = document.querySelector('#addForm') //表单
    const formInput = document.querySelector('#formInput')
    addForm.addEventListener('submit', (event) => {
      event.preventDefault()
      addTodoItem(formInput.value)
      formInput.value = ''
    })
  }

  loadTodoList()
  eventListener()
})
