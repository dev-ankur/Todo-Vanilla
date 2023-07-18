
// localstorage

let tasks = JSON.parse(localStorage.getItem('tasks'));
let selectedTask = JSON.parse(localStorage.getItem('selectedTask'));

// commons

const stages = [
    "list",         // list page
    "edit",         // new/edit page
    "preview"       // preview page
];

const sections = document.querySelectorAll('section');
const btns = document.querySelectorAll('.btn');

// list page references

var notes = document.getElementById('all-notes');
const noTask =  document.getElementById('no-task');
const addTask = document.getElementById('add-task');
var categories = document.querySelectorAll(".category > span");
var categoryIndex = 0;          // 0 -> All     1 -> Remaining      2 -> Done

// edit page references

let gohome = document.getElementById('go-home');
let preview = document.getElementById('preview-note');

// fields
let title = document.getElementById('title-edit');
let todonote = document.getElementById('note-edit');


// preview page references

let edit = document.getElementById('edit-note');
var previewTitle = document.querySelector('#preview-task h2');
var previewDescription = document.querySelector('#preview-task p');


if(!tasks){
    tasks = [];
    localStorage.setItem('tasks', JSON.stringify([]));
}

prepareList();


// category selection on click

categories.forEach((catagory, index, all)=>{

    catagory.addEventListener('click', (e)=>{
        e.preventDefault();

        all.forEach((v,i)=>{
            (catagory.dataset.cat == i) 
            ? v.classList.add('selected') 
            : v.classList.remove('selected');
        });

        categoryIndex = catagory.dataset.cat;
        prepareList();
        
    })
})

// add new task

addTask.addEventListener('click', (e)=>{
    setStage(1);
});


// go to home

gohome.addEventListener('click', (e)=>{
    setStage(0);
});


// preview

preview.addEventListener('click', (e)=>{
    if(!selectedTask.title){
        alert("'Title' is required!");
        return;
    }
    setStage(2);
});


// edit

edit.addEventListener('click', (e)=>{
    setStage(1);
});


// add title

let timer = null;

title.addEventListener('input', (e)=>{
    e.preventDefault();

    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
        // console.log(e.target.value);
        selectedTask.title = e.target.value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('selectedTask', JSON.stringify(selectedTask));
    }, 300);
});


// add task note

todonote.addEventListener('input', (e)=>{
    e.preventDefault();

    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
        // console.log(e.target.value);
        selectedTask.description = e.target.value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('selectedTask', JSON.stringify(selectedTask));
    }, 300);
});


function prepareList(){
    if(tasks.length !== 0){
        
        noTask.style.display = 'none';
        notes.innerHTML = '';

        for(let i=0;i<tasks.length;i++){

            if(
                (categoryIndex == 1 && tasks[i].status)
                || (categoryIndex == 2 && !tasks[i].status)
            ) continue;

            var task = document.createElement('li');
            var checkbox = document.createElement('input');
            var span = document.createElement('span');

            task.classList.add('note');
            
            checkbox.type = 'checkbox';
            checkbox.id = 'check-'+tasks[i].id;
            checkbox.checked = tasks[i].status;
            checkbox.addEventListener('change', (cb)=>{
                tasks[i].status = (cb.target.checked) ? 1 : 0;
                cb.target.nextSibling.style
                .textDecorationLine = tasks[i].status ? 'line-through': 'none';
                // displayTasks();
                prepareList();
                localStorage.setItem('tasks', JSON.stringify(tasks));
            });
            
            
            span.textContent = tasks[i].title;
            span.style.textDecorationLine = tasks[i].status ? 'line-through': 'none';
            span.addEventListener('click', (e)=>{
                e.preventDefault();

                selectedTask = tasks[i];
                setStage(2);    // preview
            })


            task.appendChild(checkbox);
            task.appendChild(span);

            notes.appendChild(task);
        }
    }
}


function setStage(stageIndex){

    switch (stages[stageIndex]) {

        case 'list':

            displayBtns([1,0,0,0]);
            displaySection(0);

            if(tasks.length > 0 && !tasks[0].title){
                tasks.shift();
            }else if(selectedTask && !selectedTask.title){
                tasks.splice(tasks.map(x=>x.id).indexOf(selectedTask.id), 1);
            }
            selectedTask = null;
            localStorage.setItem('selectedTask', null);
            localStorage.setItem('tasks', JSON.stringify(tasks));

            prepareList();
            
            break;

        case 'edit':

            displayBtns([0,1,0,1]);
            displaySection(1);

            if(!selectedTask){

                let newTaskId = tasks.length == 0 ? 1 : tasks[0].id + 1;

                selectedTask = {
                    id: newTaskId,
                    title: '',
                    description: '',
                    status: 0
                };
                
                tasks.unshift(selectedTask);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                localStorage.setItem('selectedTask', JSON.stringify(selectedTask));
            }else{
                title.value = selectedTask.title;
                todonote.value = selectedTask.description;
            }


            
            break;

        
        case 'preview':

            displayBtns([0,1,1,0]);
            displaySection(2);

            if(null == JSON.parse(localStorage.getItem('selectedTask'))){
                localStorage.setItem('selectedTask', JSON.stringify(selectedTask));
            }

            previewTitle.innerText = selectedTask.title;
            previewDescription.innerText = selectedTask.description;
    
        default:
            break;
    }
}

function displayBtns(arr){
    for (let i = 0; i < arr.length; i++) {
        btns[i].classList.remove('hide');
    }

    for(let i = 0; i < arr.length; i++){
        if(!arr[i]){
            btns[i].classList.add('hide');
        }
    }
}

function displaySection(ind){
    for(let i=0;i<sections.length;i++){
        sections[i].classList.remove('selected');
    }
    sections[ind].classList.add('selected');
}

/* function displayTasks(){
    let taskList = document.querySelectorAll(".notes > .note");

    for(let i=0;i<tasks.length;i++){
        taskList[i].classList.remove('hide');
    }
    if(categoryIndex == 0) return;
    
    taskList.forEach((t, i, all)=>{
        if(categoryIndex == 1){
            if(tasks[i].status) t.classList.add('hide');
        }else{
            if(!tasks[i].status) t.classList.add('hide');
        }
    })
} */