//DOM stuff here
// window.localStorage.removeItem('currentList');
// window.localStorage.removeItem('firstEnter');

const index = require('./index.js');
const factory = require('./factory.js');
const db = require('./storage.js');


//render new task
export function renderTasks(obj){
    const box = document.querySelector('.tasks-box');
    const div = document.createElement('div');
    div.classList.add('task-item');
    
    const input = document.createElement('input');
    input.setAttribute('type','checkbox'); 

    if(obj.done == true) {
        div.classList.add('task-done');
        input.checked = 'true';
    }

    if(window.localStorage.getItem('markedTask') == obj.taskName){
        div.classList.add('marked-task');
    }

    

    const i = document.createElement('i');
    i.classList.add('rm-task');
    i.classList.add('material-icons');
    i.textContent = 'close';
    
    const span = document.createElement('span');
    span.textContent = obj.taskName;

    

    //add close event
    i.addEventListener('click', () => {
        
        db.removeTask('taskLib', obj.taskName);
        div.remove();
        
        
        if(window.localStorage.getItem('markedTask') == obj.taskName) setDefaultInfo();
    });

    //add checked event
    input.addEventListener('change', (e) => {
        // add style
        if(e.target.checked){
            div.classList.add('task-done');
            
            db.chengeTaskProprety(obj.taskName, 'done', true);
            db.reOrderTasks(obj.taskName);
            
            
        } else {
            div.classList.remove('task-done');
            db.chengeTaskProprety(obj.taskName, 'done', false);
            db.reOrderTasks(obj.taskName);
            
            if(db.isListInTask(obj.taskName,'Hot')) {
                console.log('hellow');
                db.orderTaskToTop(obj.taskName);
            }
        };
        renderTaskList(window.localStorage.getItem('currentList'));

    })

    div.addEventListener('click', e => {
        if(e.toElement.tagName == 'SPAN' || e.toElement.tagName == 'DIV'){
            renderTaskInfo(obj.taskName);
        };
    })

    div.appendChild(input);
    div.appendChild(span);
    div.appendChild(i);
    box.appendChild(div);

    
    
    
    if (db.isListInTask(obj.taskName, 'My Day')){

        const j = document.createElement('i');
        j.classList.add('status-icon');
        j.classList.add('material-icons');
        j.classList.add('yellow-icon');
        j.textContent = 'wb_sunny';
        div.appendChild(j);
    }
    if (db.isListInTask(obj.taskName, 'Hot')){

        const j = document.createElement('i');
        j.classList.add('status-icon');
        j.classList.add('material-icons');
        j.classList.add('red-icon');
        j.textContent = 'whatshot';
        div.appendChild(j);
    }
}


//add new List

export function addNewList(name){
    const ul = document.querySelector('.list-list');
    const li = document.createElement('li');
    li.setAttribute('data-list',name);
    li.innerHTML = name;

    
    const i = document.createElement('i');
    i.classList.add('material-icons');
    i.classList.add('md-18');
    i.textContent = 'close';
    i.setAttribute('data-list',name);

    if(name != 'All' && name != 'My Day' && name != 'Hot') li.appendChild(i);

    ul.appendChild(li);

    

    //add list render on click event
    li.addEventListener('click', (e) => {
        renderTaskList(e.toElement.dataset.list, db.get('taskLib'));
        window.localStorage.setItem('currentList',e.toElement.dataset.list);
        setDefaultInfo();
    });

    //add close list event

    i.addEventListener('click', (e) => {

        if(window.confirm('Do you want remove this list and respective tasks?')){
            //remove list from storage
            db.removeList(e.toElement.dataset.list);
            //remove list tasks from storage
            db.removeListTasks(e.toElement.dataset.list);
            //remove list dom
            li.remove();
        }     
    });  

    
}

//render all lists

export function renderLists(json){

    //clear lists

    const itemList = document.querySelectorAll('.list-list li');

    for(let i = 0; i < itemList.length; i++){
        itemList[i].remove();
    }

    for(let i in json){
        addNewList(json[i].name);
    }
    
}

//render current task List

export function renderTaskList(list){

    let json = db.get('taskLib');
    //clear items
    const itemList = document.querySelectorAll('.task-item');

    for(let i = 0; i < itemList.length; i++){
        itemList[i].remove();
    }

    //look for list in our json library
    for(let i in json){
        for(let j in json[i].lists){       
            if (json[i].lists[j] == list){
                renderTasks(json[i]);
                break;
            }
        }
    }

    markCurrentList(list);
}

function markCurrentList(listName){
    
    //clear marks
    document.querySelectorAll('.list-list li').forEach(element => {
        element.classList.remove('marked-li');
        if (element.dataset.list == listName) element.classList.add('marked-li');
    });
    
}

export function renderTaskInfo(name) {
    //add some style to marked tasks
    document.querySelectorAll('.task-item').forEach(i => {
        i.classList.remove('marked-task');
        if (i.querySelector('span').textContent == name){
            i.classList.add('marked-task');
        }
    })
    
    window.localStorage.setItem('markedTask', name);

    const info = document.querySelector('.info');
    info.innerHTML = '';

    renderDisc(name);
    renderMyDay(name);
    renderHot(name);

    //document.querySelector('.info').innerHTML = name;
}

function renderDisc(name){
    const info = document.querySelector('.info');
    const text = document.createElement('textarea');
    text.setAttribute('placeholder', 'Tast discription..');
    //text.classList.add('');
    text.value = (db.getTaskProp(name, 'disc') == undefined) ? '' : db.getTaskProp(name, 'disc');
    
    info.appendChild(text);
    
    

    text.addEventListener('input',e => {
        
        db.chengeTaskProprety(name, 'disc', e.target.value);
    })
    
};

function renderMyDay(name){
    
    if(document.querySelector('.myday-box')) document.querySelector('.myday-box').remove();

    const textarea = document.querySelector('.info textarea');
    
    const div = document.createElement('div');
    div.classList.add('myday-box')
    const i = document.createElement('i');
    i.classList.add('material-icons');
    i.textContent = 'wb_sunny';
    i.classList.add('yellow-icon');

    const span = document.createElement('span');

    //console.log(db.isList(name,'My Day'));

    //check is task in myday list and add relevant event - 
    //change div style add My Day list to selected Item, rerender current list if need 

    if(db.isListInTask(name,'My Day') == false){
        
        span.textContent = 'Add to My Day';

        div.addEventListener('click', () => {
            db.addListToTask(name,'My Day');
            renderMyDay(name);
            renderTaskList(window.localStorage.getItem('currentList'));
            if(window.localStorage.getItem('currentList') == 'My Day') {
                
            }
        })


    } else {
        span.textContent = 'Remove from My Day';
        
        div.addEventListener('click', () => {
            db.removeListFromTask(name,'My Day');
            renderMyDay(name);
            renderTaskList(window.localStorage.getItem('currentList'));
            if(window.localStorage.getItem('currentList') == 'My Day') {
                setDefaultInfo();
            }
        })

    };

   // info.appendChild(div);
    insertAfter(textarea,div)


    div.appendChild(i);
    div.appendChild(span);
   // renderHot();
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function renderHot(name){
    
    if(document.querySelector('.hot-box')) document.querySelector('.hot-box').remove();

    const info = document.querySelector('.info');
    const div = document.createElement('div');
    div.classList.add('hot-box')
    const i = document.createElement('i');
    i.classList.add('material-icons');
    i.textContent = 'whatshot';
    i.classList.add('red-icon');

    const span = document.createElement('span');

    //console.log(db.isList(name,'My Day'));

    //check is task in myday list and add relevant event - 
    //change div style add My Day list to selected Item, rerender current list if need 

    if(db.isListInTask(name,'Hot') == false){
        
        span.textContent = 'Add to Hot';

        div.addEventListener('click', () => {
            db.addListToTask(name,'Hot');
            db.orderTaskToTop(name);
            renderHot(name);
            renderTaskList(window.localStorage.getItem('currentList'));   
        })


    } else {
        span.textContent = 'Remove from Hot';
        
        div.addEventListener('click', () => {
            db.removeListFromTask(name,'Hot');
            renderHot(name);
            renderTaskList(window.localStorage.getItem('currentList'));
        })

    };

    info.appendChild(div);
    div.appendChild(i);
    div.appendChild(span);
}

//default info field

export function setDefaultInfo(){

    document.querySelectorAll('.task-item').forEach(i => {
        i.classList.remove('marked-task');
    })

    document.querySelector('.info').innerHTML = '<img src="caduceus.jpg" alt="caduceus.jpg" width="200px">';
    
}




