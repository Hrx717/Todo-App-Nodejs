const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const addTaskError = document.getElementById("add-task-error");
const todoList = document.getElementById("todoList");

const showDataToClient = (data) => {
    if(!data) return;
    data.forEach(element => {
        const ithTodo = document.createElement("div");
        ithTodo.classList.add('each-task-div');
        const taskNode = document.createElement("span");
        taskNode.innerText = element.task;

        const completeButton = document.createElement("button");
        if(!element.complete)    completeButton.innerText = "Complete";
        else {completeButton.innerText = "Completed";taskNode.classList.add("add-a-strike");}
        completeButton.id = element._id;
        completeButton.addEventListener('click', completeThisTask);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.id = element._id;
        deleteButton.addEventListener('click', deleteThisTask);

        ithTodo.appendChild(taskNode);
        ithTodo.appendChild(completeButton);
        ithTodo.appendChild(deleteButton);

        todoList.appendChild(ithTodo);
    });
}

const getDataFromServer = async () => {
    const response = await fetch(`${window.location.href}api/todo`);
    const data = await response.json();
    if(data.length==0) showDataToClient([]);
    showDataToClient(data);
}

getDataFromServer();

const sendDataToServer =  async (data) => {
    const response = await fetch("/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if(!response.ok) {
        addTaskError.innerText = "Something went wrong! " + response.status;
    }
}

addTaskBtn.addEventListener("click", () => {
    const taskUserInput = taskInput.value.trim().toUpperCase();
    taskInput.value = "";
    if(!taskUserInput) {
        addTaskError.innerText = "Enter valid task/input";
        setTimeout(()=> {
            addTaskError.innerText = "";
        },3000);
        return;
    }
    const taskBody = {task: taskUserInput, complete: false};
    showDataToClient([taskBody]);
    sendDataToServer(taskBody);
});

function completeThisTask(e) {
    let content;
    const element = document.getElementById(e.target.id);
    const parent = element.parentElement;
    if(e.target.innerText=="Complete") {
        e.target.innerText = "Completed";
        content = true;
        parent.children[0].classList.add('add-a-strike'); 
    }
    else {
        e.target.innerText = "Complete";
        content = false; 
        parent.children[0].classList.remove('add-a-strike'); 
    }
    const taskBody = {id: e.target.id, type: 1,content:content};
    sendDataToServer(taskBody);
}

function deleteThisTask(e) {
    const taskBody = {id: e.target.id, type: 2};
    sendDataToServer(taskBody);
    const element = document.getElementById(e.target.id);
    const parent = element.parentElement;
    todoList.removeChild(parent);
}