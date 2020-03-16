

export let taskJSON = [];

// selected list (global var)
export let currentList = 'All';

//window.localStorage.setItem('currentList', 'All');

const factory = require('./factory.js');
const render = require('./render.js');
const db = require('./storage.js');

//window.localStorage.removeItem('firstEnter');

window.localStorage.setItem('currentList', 'All');

render.renderLists(db.get('listLib'));
render.renderTaskList(window.localStorage.getItem('currentList'));
render.setDefaultInfo();


// add new list on button click

document.querySelector('#list-submit').addEventListener('click',function(){
    const input = document.querySelector('#list-input');

    if(db.checkListExist(input.value)){
        alert('You already have this list')
    } else if(input.value == ''){
        alert('set list value');
    } else {
       
        window.localStorage.setItem('`List',input.value);
        factory.makeList(input.value);
        render.addNewList(input.value, db.get('taskLib'));
        render.renderTaskList(input.value)
        input.value = '';

    }

    render.setDefaultInfo();
});

//add new task on button click 

document.querySelector('#task-submit').addEventListener('click', () => {
    const input = document.querySelector('#task-input');

    if(db.checkTaskExist(input.value)){
        alert('You already have this task')
    } else if(input.value == ''){
        alert('set task value');
    } else {
        
        taskJSON.push(new factory.makeTask(window.localStorage.getItem('currentList'), input.value));
        render.renderTaskList(window.localStorage.getItem('currentList'));
        render.renderTaskInfo(input.value);
        input.value = '';
    }
});









