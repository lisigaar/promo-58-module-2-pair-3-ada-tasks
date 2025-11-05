"use strict";

const listElement = document.querySelector(".js_list_task");
const task = document.querySelectorAll(".task");
const GITHUB_USER = "jenniferromanmuerte";
const SERVER_URL = `https://dev.adalab.es/api/todo/${GITHUB_USER}`;

let tasks = [];

function renderTask(tasks) {
  for (const task of tasks) {
    if (task.completed === true) {
      listElement.innerHTML += `
      <li class="task completed">${task.name}
      
      </li>`;
    } else {
      listElement.innerHTML += `<li class="task">${task.name}</li>`;
    }
  }
}

fetch(SERVER_URL)
  .then (  (response) => response.json ()  )
  .then (  (data) => {
    tasks = data.results;
    renderTask(tasks);
  });




