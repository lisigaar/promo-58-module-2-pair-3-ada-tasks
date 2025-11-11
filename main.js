"use strict";

const listElement = document.querySelector(".js_list_task");
const task = document.querySelectorAll(".task");
const GITHUB_USER = "jenniferromanmuerte2";
const SERVER_URL = `https://dev.adalab.es/api/todo/${GITHUB_USER}`;
const counter = document.querySelector(".js_counter");
const butonAdd = document.querySelector(".js-butonAdd");
const inputAdd = document.querySelector(".js-inputAdd");
const butonSearch = document.querySelector('.butonSearch');
const inputSearch = document.querySelector('.inputSearch');
// Obtenemos la variable sin parsearla, porque si parseamos sobre null, falla
const tasksLocalStorage = localStorage.getItem("tasks");

let tasks = [];
let counterChecked = 0;
let counterNotChecked = 0;

// Función para pintar las tareas que recibimos del servidor
function renderTask(tasks) {
  listElement.innerHTML = ""; // limpia el listado
  counterChecked = 0; //reiniciamos antes de volver a contar
  counterNotChecked = 0; //reiniciamos antes de volver a contar
  // Recorremos el array de tareas
  for (const task of tasks) {
    // Si tarea está completada
    if (task.completed === true) {
      // La añadimos al contador de tareas completadas
      counterChecked += 1;
      // La pintamos en html de esta manera (con el checked y la clase completed)
      listElement.innerHTML += `
      <li class="task completed">
      <input class="inputCheck" type="checkbox" id=${task.id} checked/>
      <label for=${task.id}>${task.name}</label>
      </li>`;
      // Si la tarea no está completada
    } else {
      // La añadimos al contador de tareas NO completadas
      counterNotChecked += 1;
      // La pintamos en html de esta manera (sin el checked y sin la clase completed)
      listElement.innerHTML += `
      <li class="task">
      <input class="inputCheck" type="checkbox" id=${task.id}/>
      <label for=${task.id}>${task.name}</label>
      </li>`;
    }
  }
  // Llamamos a la función para pintra los contadores
  renderCount(tasks, counterChecked, counterNotChecked);
  // Capturamos los check después de pintarlos
  const checkboxes = document.querySelectorAll(".inputCheck");
  // Llamamos a la función pasandole el array de los checkBox
  isChecked(checkboxes);
}

/*
Función para saber si está clicado,
recibe un array con todos los checkboxes,
recorremos el array, accedemos al li que contiene cada checkbox,
creamos un evento para cada uno de ellos que salta si cambia,
dentro del evento comprovamos si está seleccionado o no,
dependiendo de la acción modificamos los contadores y quitamos o añadimos la clase de subrayado
llamamos a la función que pinta los contadores pasandole los nuevos valores
*/
const isChecked = (checkboxes) => {
  checkboxes.forEach((checkbox) => {
    // Accedemos al elemento li de cada checkbox para usarlo después
    let liElement = checkbox.closest("li");
    // Añadimos un evento a cada checkbox
    checkbox.addEventListener("change", (ev) => {
      // Comprobamos si está seleccionado
      if (checkbox.checked) {
        // Si se marca se actualizan los marcadores
        counterChecked++;
        counterNotChecked--;
        // Se añade la clase de tachado al elemento li
        liElement.classList.add("completed");
      } else if (!checkbox.checked) {
        // Si se desmarca se actualizan los marcadores
        counterNotChecked++;
        counterChecked--;
        // Se quita la clase de tachado al elemento li
        liElement.classList.remove("completed");
      }
      // Llamamos a la función que pinta los contadores pasandole los nuevos valores
      renderCount(counterChecked, counterNotChecked);
    });
  });
};

// Función para pintar los contadores con los valores actualizados
const renderCount = (tasks, counterChecked, counterNotChecked) => {
  counter.innerHTML = `
Tienes ${tasks.length} tareas,
${counterChecked} completadas y
${counterNotChecked} por realizar
`;
};

// Función para añadir una nueva tarea
const handleNewTask = (event) => {
  event.preventDefault();

  // 1. Recoge el nombre de la tarea
  const nameNewTask = inputAdd.value;
  // 2. Crea un objeto para la nueva tarea
  const newTask = {
    name: nameNewTask, // sustituye este string vacío por el nombre de la tarea nueva
    completed: false,
  };

  // 3. Añade la nueva tarea al array de tareas
  fetch(SERVER_URL, {
    method: "POST", // Especificamos el método POST
    body: JSON.stringify(newTask), // Convertimos el objeto a JSON y lo incluimos en el cuerpo
    headers: {
      "Content-Type": "application/json", // Indicamos que enviamos datos en formato JSON
    },
  })
    .then((response) => response.json())
    .then((data) => {

        fetch(SERVER_URL)
          .then((response) => response.json())
          .then((data) => {
            console.log('Los datos que recibo despues de ingresar la nueva tarea',data)
            tasks = data.results;
        //guarda el listado obtenido en el Local Storage pasandolo a string
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // pinta la lista de tareas recuperandolas del localStorage parseandolas a objetos
        renderTask(JSON.parse(localStorage.getItem("tasks")));


      inputAdd.value = ""; // Dejamos el input vacio
    })
    .catch((error) => console.error("Error al crear tarea:", error));
  });
};


const searchTask = (ev) =>{
  ev.preventDefault();
  let textSearch = inputSearch.value;
  const taskFilter = tasks.filter((task) =>{
    return task.name.includes(textSearch);
  });
  renderTask(taskFilter);
}

// EVENTOS
butonAdd.addEventListener("click", handleNewTask);

butonSearch.addEventListener("click", searchTask);


if (tasksLocalStorage !== null) {
  tasks = JSON.parse(tasksLocalStorage);
  renderTask(tasks);
} else {
  //sino existe el listado de tareas en el local storage
  // pide los datos al servidor
  fetch(SERVER_URL)
    .then((response) => response.json())
    .then((data) => {
      tasks = data.results;
      //guarda el listado obtenido en el Local Storage pasandolo a string
      localStorage.setItem("tasks", JSON.stringify(tasks));
      // pinta la lista de tareas recuperandolas del localStorage parseandolas a objetos
      renderTask(JSON.parse(localStorage.getItem("tasks")));
    })
    .catch((error) => {
      console.error(error);
    });
}

