//array untuk menampung object besisi data todo user
const todos = [];

//untuk mendefinisikan Custom Event bernama render-todo.
//sebagai patokan dasar ketika ada perubahan data pada variabel todos
const RENDER_EVENT = 'render-todo';


//listener yang akan menjalankan kode yang ada didalamnya ketika event DOMContentLoaded dibangkitkan
document.addEventListener('DOMContentLoaded', function() {
    //menyiapkan elemen form untuk menangani event submit
    const submitForm = document.getElementById('form');

    //listener yang akan menjalankan kode didalamnya ketika event submit dibangkitkan
    submitForm.addEventListener('submit', function(event) {
        
        //membuat data tidak hilang ketika dimuat ulang
        event.preventDefault();
        //menjalankan fungsi addTodo
        addTodo();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

    

//membuat fungsi addTodo
function addTodo() {
    //mengambil nilai yang diinput user
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;

    //untuk generate id
    const generatedID = generateId();
    //membuat sebuah object dari todo
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    //untuk menyimpan todoObject kedalam array todos menggunakan motode push
    todos.push(todoObject);

    //custom event untuk me-render data yang telah disimpan pada array todos
    document.dispatchEvent(new Event(RENDER_EVENT));

    //menyimpan data
    saveData();
}

//membuat fungsi generateId untuk meghasilkan identitas unik pada setiap item todo
function generateId() {
    //mengembalikan nilai berupa timestamp pada javascript
    return +new Date();
}

//membuat object baru dari data yang sudah disediakan dari inputan
function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

/*
//Untuk memastikan fungsi berhasil, maka perlu membuat listener dari RENDER_EVENT yag ditampilkan pada console
document.addEventListener(RENDER_EVENT, function () {
    console.log(todos)
});
*/


//membuat fungsi makeTodo
function makeTodo (todoObject) {
    //membuat object DOM (elemen HTML heading level 2)
    const textTitle = document.createElement('h2');
    //menyematkan konten berupa teks (tak berformat HTML) pada elemen HTML
    textTitle.innerText = todoObject.task;

    //membuat object DOM (elemen HTML paragraf)
    const textTimestamp = document.createElement('p');
    //menyematkan konten berupa teks (tak berformat HTML) pada elemen HTML
    textTimestamp.innerText = todoObject.timestamp;

    //membuat object DOM (elemen HTML div)
    const textContainer = document.createElement('div');
    //menambahkan class pada elemen
    textContainer.classList.add('inner');
    //menambahkan textTitle dan textTimestamp pada elemen
    textContainer.append(textTitle, textTimestamp);

    //membuat object DOM (elemen HTML div)
    const container = document.createElement('div');
    //menambahkan class pada elemen
    container.classList.add('item', 'shadow');
    //menambahkan textContainer pada elemen
    container.append(textContainer);
    //menetapkan id pada element
    container.setAttribute('id', `todo-${todoObject.id}`);
    
    
    if (todoObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');

      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(todoObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');

      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(todoObject.id);
      });
      
      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(todoObject.id);
      });

      container.append(checkButton);
    }

    return container
}


//Memindahkan todo dari rak “Yang harus dilakukan” ke rak “Yang sudah dilakukan”
function addTaskToCompleted (todoId) {
  const todoTarget = findTodo(todoId);
  
  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  //menyimpan data
  saveData();
}

//Untuk mencari todo dengan ID yang sesuai pada array todos
function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

//Untuk memindahkan selesai ke belum selesai
function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;
 
  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  //menyimpan data
  saveData();
}

//Untuk menghapus todo
function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
 
  if (todoTarget === -1) return;
 
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  //menyimpan data
  saveData();
}

//Mengimplemantasikan findTodoIndex() agar bisa menghapus todo dengan baik
function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
 
  return -1;
}


//Menyimpan Data Pada Browser Storage
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function saveData() {
  if (isStorageExist()) {
    //konversi data object ke string
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

//Membuat data tetap ditampilkan ketika dimuat ulang
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

//Membuat listener
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  uncompletedTODOList.innerHTML = '';
 
  const completedTODOList = document.getElementById('completed-todos');
  completedTODOList.innerHTML = '';
 
  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted)
      uncompletedTODOList.append(todoElement);
    else
      completedTODOList.append(todoElement);
  }
});