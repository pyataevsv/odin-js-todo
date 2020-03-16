//window.localStorage.removeItem('firstEnter');

const factory = require('./factory.js');

window.localStorage.removeItem('markedTask');

// preset library at first entrance
if(window.localStorage.getItem('firstEnter') == null){
    window.localStorage.setItem('taskLib','[]');
    window.localStorage.setItem('listLib','[]');
    window.localStorage.setItem('currentList', 'All');
    new factory.makeTask('Sport', 'HIIT workout');
    new factory.makeTask('Sport', 'Kettlebells workout');
    new factory.makeTask('All', 'Make to-to list');
    new factory.makeList('All');
    new factory.makeList('My Day');
    new factory.makeList('Hot');
    new factory.makeList('Sport');

    window.localStorage.setItem('firstEnter','true');
    
};

// get lib from localstorage

export function get(lib){
    return JSON.parse(window.localStorage.getItem(lib));
}

//remove taks from local storage
export function removeTask(lib, name){
    let json = get(lib);

    for(let i in json){
        if(json[i].taskName == name){
            json.splice(i,1);
        }
    }

    window.localStorage.setItem(lib, JSON.stringify(json));

}

export function removeList(name){
    let json = get('listLib');

    for(let i in json){
        if(json[i].name == name){
            json.splice(i,1);
        }
    }

    window.localStorage.setItem('listLib', JSON.stringify(json));

}

export function removeListTasks(listName){

    let json = get('taskLib');
    let filtered = json.filter(item => !item.lists.includes(listName));
    window.localStorage.setItem('taskLib', JSON.stringify(filtered));

}

export function chengeTaskProprety(taskName, propName, value){
    let json = get('taskLib');

    json.forEach(element => {
        if (element.taskName == taskName) {
            element[propName] = value;

        }
    });

    window.localStorage.setItem('taskLib', JSON.stringify(json));
}

export function reOrderTasks(name){
    let json = get('taskLib');
    let bufObj = {};

    json.forEach((item,i) => {
        if (item.taskName == name){
            bufObj = json.splice(i,1);
            
        }
    });
    

    for (let i in json){
        if (json[i].done == true){
            json.splice(i,0,bufObj[0]);
            break
        }
        if (i == json.length-1){
            json.push(bufObj[0]);
        }
    }

    window.localStorage.setItem('taskLib', JSON.stringify(json));
}

export function getTaskProp(name, prop){
    let json = get('taskLib');

    for (let i in json){
        if (json[i].taskName == name) return json[i][prop];
    }

}

export function removeListFromTask(name, list){
    let json = get('taskLib');

    if (list != 'All'){
        for (let i in json){
            if (json[i].taskName == name){
                json[i].lists.splice(json[i].lists.indexOf(name),1);
                
            }
        }
    } 

    window.localStorage.setItem('taskLib', JSON.stringify(json));
}

export function addListToTask(name, list){
    let json = get('taskLib');
    if (list != 'All'){
        for(let i in json){
            if (json[i].taskName == name) {
                json[i].lists.push(list);
                     
            }
        }
    }

    window.localStorage.setItem('taskLib', JSON.stringify(json));
}

export function isListInTask(name, list){
    let json = get('taskLib');

    for (let i in json){
        if (json[i].taskName == name){      
            
            
            for( let j in json[i].lists){
                if(json[i].lists[j] == list) return true;
            }
        
        }
    }
    return false;
}

export function orderTaskToTop(name){
    let json = get('taskLib');
    let buf = {};
    for (let i in json){
        if(json[i].taskName == name && json[i].done == false){
            console.log(json);
            buf = json.splice(i,1)[0];
            console.log(buf);
            console.log(json);
            json.unshift(buf);
            console.log(json);
            break;
        }
    }
    window.localStorage.setItem('taskLib', JSON.stringify(json));
}

export function checkTaskExist(name){
    let json = get('taskLib');

    for(let i in json){
        if(json[i].taskName == name) return true;
    }

    return false;
}

export function checkListExist(list){
    let json = get('listLib');
    
    for(let i in json){
        console.log(json[i].name);
        if(json[i].name == list) return true;
    }

    return false;
}