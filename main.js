"use strict";

const listElement = document.querySelector(".js_list_task");
const task = document.querySelectorAll(".task");
const SERVER_URL = `https://dev.adalab.es/api/todo`;

let tasks = [];

function renderTask(tasks) { console.log ('estoy entrando a render task y recibo' + tasks)
  for (const task of tasks) {
    if (task.completed === true) {
      listElement.innerHTML += `<li class="task completed">${task.name}</li>`;
    } else {
      listElement.innerHTML += `<li class="task">${task.name}</li>`;
    }
  }
}

fetch(SERVER_URL).then ((response) => response.json () ).then ((data) => 
    (tasks= data.results),
renderTask(tasks)
);


//Mirar por qué no llegan las tareas

