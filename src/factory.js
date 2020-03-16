

// task constructor

export function makeTask(listName,taskName) {
    
    let a = ['All'];
    if (listName != 'All'){
        a.push(listName);
    }

    this.done = false;
    this.taskName = taskName;
    this.lists = a;
    this.disc = '';

    this.changeDone = function() {
      this.done = !this.done;
    };

    this.addList = function(newList){
        
        if (newList != 'All'){
            this.lists.push(newList);
        }  
    }

    // add obj to local storage

    let json = JSON.parse(window.localStorage.getItem('taskLib'));
    json.unshift(this);
    window.localStorage.setItem('taskLib', JSON.stringify(json));
    
  }

export function makeList(name){
    this.name = name;

    //add list to local storage
    let json = JSON.parse(window.localStorage.getItem('listLib'));
    json.push(this);
    window.localStorage.setItem('listLib', JSON.stringify(json));
}

 