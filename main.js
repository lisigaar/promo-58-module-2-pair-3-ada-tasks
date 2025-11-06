"use strict";

const listElement = document.querySelector(".js_list_task");
const task = document.querySelectorAll(".task");
const GITHUB_USER = "jenniferromanmuerte";
const SERVER_URL = `https://dev.adalab.es/api/todo/${GITHUB_USER}`;
const counter = document.querySelector(".js_counter");

let tasks = [];
let counterChecked = 0;
let counterNotChecked = 0;

// Función para pintar las tareas que recibimos del servidor
function renderTask(tasks) {
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
  renderCount(counterChecked, counterNotChecked);
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
const renderCount = (counterChecked, counterNotChecked) => {
  counter.innerHTML = `
Tienes ${tasks.length} tareas,
${counterChecked} completadas y
${counterNotChecked} por realizar
`;
};

// Obtenemos los datos del servidor
fetch(SERVER_URL)
  .then((response) => response.json())
  .then((data) => {
    tasks = data.results;
    renderTask(tasks);
  });
