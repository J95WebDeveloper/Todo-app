const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const emptyImage = document.getElementById("emptyImage");
const addIcon = document.getElementById("addIcon").querySelector("i"); // Get the icon inside button
const toastBox = document.getElementById('toastBox')


let allTodos = LoadTodos();
updateTodos();
let EditId;
let isEditBtn = false;
let isPresent = false;


todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoText = todoInput.value.trim();
  if (todoText === "") {
    showMessage("Please write your todo...", "error");
    return;
  }

  isPresent = allTodos.todoList.some((e, index) => {
    return e.text === todoText && index !== EditId; // Ignore the current item if editing
  });

  if (isPresent) {
    showMessage("This todo is already present in the list...", 'error');
    todoInput.value = "";
    return;
  }

  addTodos();
});


//  show Todos  
function showTodo() {
  if (todoList.children.length === 0) {
    emptyImage.style.display = "block"; // Show the empty image
  } else {
    emptyImage.style.display = "none"; // Hide the empty image
  }
}


//   add todos  
function addTodos() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    if (!isEditBtn) {
      const todoObj = {
        text: todoText,
        completed: false,
      };
      allTodos.todoList.push(todoObj);
      showMessage("Todo added successfully!", "success");
    } else {
      isEditBtn = false;
      allTodos.todoList[EditId].text = todoText;
      addIcon.classList.remove("bi-check");
      addIcon.classList.add("bi-plus");
      showMessage("Todo updated successfully!", "success");
    }
    addToLocalStorage();
    updateTodos();
    todoInput.value = "";
  }
}


// update todos
function updateTodos() {
  todoList.innerHTML = "";
  allTodos.todoList.forEach((todo, id) => {
    todoItem = CreateTodos(todo, id);
    todoList.appendChild(todoItem);
  });

  showTodo();
}

function CreateTodos(todo, id) {
  const todoLI = document.createElement("li");
  const todoText = todo.text;
  todoLI.innerHTML = `
            <label for='${id}' class='todo-text'>
               <input type='checkbox' id='${id}' />
               <span class="custom-checkbox"></span>
               <span class='text'>${todoText}</span>
            </label>
            <span class="icon-buttons">
            <i class="fa-regular fa-pen-to-square edit"></i>
            <i class="fa fa-trash delete"></i>
            </span>
      `;

  const checkbox = todoLI.querySelector("input");
  checkbox.addEventListener("change", () => {
    allTodos.todoList[id].completed = checkbox.checked;
    if (checkbox.checked) {
      editBtn.style.display = "none";
    } else {
      editBtn.style.display = "block";
    }
    addToLocalStorage();
  });
  checkbox.checked = todo.completed;

  const editBtn = todoLI.querySelector(".edit");
  editBtn.addEventListener("click", () => EditBtn(id, todoText));
  if (checkbox.checked) {
    editBtn.style.display = "none";
  } else {
    editBtn.style.display = "block";
  }

  const deleteBtn = todoLI.querySelector(".delete");
  deleteBtn.addEventListener("click", () => DeleteBtn(id));

  return todoLI;
}


// Delete Todo
function DeleteBtn(id) {
  allTodos.todoList.splice(id, 1);
  addToLocalStorage();
  updateTodos();
  showMessage("Todo deleted successfully!", 'success');
}


//   Edit todo
function EditBtn(id, todoText) {
  EditId = id;
  isEditBtn = true;
  todoInput.value = todoText;
  addIcon.classList.remove("bi-plus");
  addIcon.classList.add("bi-check");
}


//  LocalStorage
function LoadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || { todoList: [] };
  return todos;
}

function addToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(allTodos));
}


//  toast container
function showMessage(message, type = "success") {
  const toast = document.createElement("div");
  toast.classList.add('toast')

  toastBox.appendChild(toast)

  const successIcon = '<i class="fas fa-check-circle"></i>';
  const errorIcon = '<i class="fas fa-times-circle"></i>';
  // Set message with icon
  toast.innerHTML = (type === "success" ? successIcon : errorIcon) + " " + message;

  if (type === "success") {
    toast.classList.add("success"); // Add success class
  } else {
    toast.classList.add("error"); // Add error class
  }

  setTimeout(() => {
    toast.remove()
  }, 2000);
}
