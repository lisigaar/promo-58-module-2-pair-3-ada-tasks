"use strict";

const listElement = document.querySelector(".js_list_task");
const task = document.querySelectorAll(".task");
const GITHUB_USER = "jenniferromanmuerte";
const SERVER_URL = `https://dev.adalab.es/api/todo/${GITHUB_USER}`;
const counter = document.querySelector ('.js_counter');


let tasks = [];
let counterChecked = 0;
let counterNotChecked = 0;

function renderTask(tasks) {
  for (const task of tasks) {

    if (task.completed === true) {
      counterChecked += 1;
      listElement.innerHTML += `
      <li class="task completed">
      <input class="inputCheck" type="checkbox" id=${task.id} checked/>
      <label for=${task.id}>${task.name}</label>
      </li>`;
    } else {
      counterNotChecked += 1;
      listElement.innerHTML += `
      <li class="task">
      <input class="inputCheck" type="checkbox" id=${task.id}/>
      <label for=${task.id}>${task.name}</label>
      </li>`;
    }
  }
  counter.innerHTML = `Tienes ${tasks.length} tareas, ${counterChecked} completadas y ${counterNotChecked} por realizar`
  const checkboxes = document.querySelectorAll ('.inputCheck');
}

// Crear función y pasarle los checkboxes



 checkboxes.forEach((checkbox)=>{
  checkbox.addEventListener ('change', (ev) => {
    console.log ('estoy entrando al evento');
  if (checkbox.checked){
    counterChecked ++;
  }
  else {
    counterNotChecked ++;
  }
  })

 })

fetch(SERVER_URL)
  .then (  (response) => response.json ()  )
  .then (  (data) => {
    tasks = data.results;
    renderTask(tasks);
  });




