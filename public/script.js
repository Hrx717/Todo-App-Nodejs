const todoList = document.getElementById("todoList");

let taskDB = [];

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
        completeButton.id = element.id;
        completeButton.addEventListener('click', completeThisTask);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.id = element.id;
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
    if(!data)   return;

    taskDB = await JSON.parse(data);
    showDataToClient(taskDB);
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
        // addTaskError.innerText = "Something went wrong! " + response.status;
        console.log("Something went wrong!" + response.status);
    }
}

function completeThisTask(e) {
    const element = document.getElementById(e.target.id);
    const parentElement = element.parentElement;
    const children = todoList.childNodes;
    let index;
    for(index=1; index<children.length; index++) {
        if(children[index] == parentElement) {break;}
    }
    taskDB[index-1].complete = !taskDB[index-1].complete;
    if(!taskDB[index-1].complete) {
        element.innerText = "Complete";
        parentElement.children[0].classList.remove("add-a-strike");
    }
    else {
        element.innerHTML = "Completed";
        parentElement.children[0].classList.add("add-a-strike");
    }
    sendDataToServer(taskDB);
}

function deleteThisTask(e) {
    const element = document.getElementById(e.target.id);
    const parentElement = element.parentElement;
    const children = todoList.childNodes;
    let index;
    for(index=1; index<children.length; index++) {
        if(children[index] == parentElement) {todoList.removeChild(children[index]);;break;}
    }
    taskDB.splice(index-1,1);
    for(let i=index-1; i<taskDB.length;i++) {
        taskDB[i].id = (i+1);
    }
    sendDataToServer(taskDB);
}