let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const search = document.getElementById("search");

let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {

    taskList.innerHTML = "";

    let filtered = tasks.filter(task => {

        if(currentFilter==="active")
            return !task.completed;

        if(currentFilter==="completed")
            return task.completed;

        return true;

    });

    filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(search.value.toLowerCase())
    );

    filtered.forEach(task => {

        const li = document.createElement("li");

        if(task.completed)
            li.classList.add("completed");

        li.innerHTML = `
        <div class="task">

            <input
            type="checkbox"
            ${task.completed ? "checked":""}
            onchange="toggleTask(${task.id})">

            <span>${task.text}</span>

        </div>

        <div class="actions">

            <button class="edit"
            onclick="editTask(${task.id})">
            Edit
            </button>

            <button class="delete"
            onclick="deleteTask(${task.id})">
            Delete
            </button>

        </div>
        `;

        taskList.appendChild(li);

    });

}

function addTask(){

    const text = taskInput.value.trim();

    if(text===""){
        alert("Please enter a task");
        return;
    }

    tasks.push({

        id:Date.now(),
        text:text,
        completed:false

    });

    taskInput.value="";

    saveTasks();

    renderTasks();

}

function deleteTask(id){

    tasks = tasks.filter(task=>task.id!==id);

    saveTasks();

    renderTasks();

}

function editTask(id){

    const task = tasks.find(task=>task.id===id);

    const updated = prompt("Edit Task",task.text);

    if(updated!==null && updated.trim()!==""){

        task.text = updated.trim();

        saveTasks();

        renderTasks();

    }

}

function toggleTask(id){

    const task = tasks.find(task=>task.id===id);

    task.completed=!task.completed;

    saveTasks();

    renderTasks();

}

addBtn.addEventListener("click",addTask);

taskInput.addEventListener("keypress",e=>{

    if(e.key==="Enter")
        addTask();

});

search.addEventListener("input",renderTasks);

document.querySelectorAll(".filter").forEach(btn=>{

    btn.addEventListener("click",()=>{

        document.querySelectorAll(".filter")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();

    });

});

renderTasks();