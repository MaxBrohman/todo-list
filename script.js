class List{
	constructor(){
		this.todoList = document.querySelector('.todo-list');
		this.doneList = document.querySelector('.todo-list.done');
		this.emptyListMessage = document.querySelector('.empty-tasks');
		this.taskInput = document.querySelector('.add-form-input');
		//создаются объекты для рендера задач
		this.activeTasks = {};
		this.nonActiveTasks = {};

		//если есть сохраненные объекты, то они будут отрисованы
		Object.keys(window.localStorage).forEach(key => {
			this.checkTasksInStorage(key, key === 'activeTasks' ? this.todoList : this.doneList);
		});

		document.querySelector('.add-form').addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.createItem(this.taskInput.value, this.todoList, this.activeTasks);
			this.taskInput.value = '';
		});
  	}

	toggleEmptyListMessage = () => {
		this.todoList.children.length === 0 ? 
		this.emptyListMessage.classList.remove('hidden') : 			this.emptyListMessage.classList.add('hidden');
  	}

	addCheckHandler = (item) => {
		const input = item.querySelector('input');
		input.addEventListener('change', () => {
			this.transferItem(item, input.checked, item.parentNode, input.checked ? this.doneList : this.todoList);
		});
	}


	//при создании задачи назначается ИД и задача добавляется в хранилище, если ее там нет
	createItem = (value, list, tasks, id) => {
		let newItem = document.querySelector('#task-template').content.querySelector('.todo-list-item').cloneNode(true);
		newItem.querySelector('span').textContent = value;
		this.addCheckHandler(newItem);
		if(!id) {
			newItem.dataset.id = new Date().getMilliseconds();
			tasks[newItem.dataset.id] = value;
			window.localStorage.setItem('activeTasks', JSON.stringify(tasks));
		} else{
			newItem.dataset.id = id;
		}
		if(tasks === this.nonActiveTasks){
			newItem.classList.add('done');
			newItem.querySelector('input').checked = true;
		}
		list.appendChild(newItem);
		this.toggleEmptyListMessage();
	}

	//при перемещении задачи из одного списка в другой, хранилище обновляется 
	transferItem = (item, isDone, fromList, toList) => {
		const passenger = fromList.removeChild(item);
		if(isDone){
			passenger.classList.add('done');
			this.nonActiveTasks[item.dataset.id] = item.textContent;
			window.localStorage.setItem('nonActiveTasks', JSON.stringify(this.nonActiveTasks));
			delete this.activeTasks[item.dataset.id];
			window.localStorage.setItem('activeTasks', JSON.stringify(this.activeTasks));
		} else{
			passenger.classList.remove('done');
			this.activeTasks[item.dataset.id] = item.textContent;
			window.localStorage.setItem('activeTasks', JSON.stringify(this.activeTasks));
			delete this.nonActiveTasks[item.dataset.id];
			window.localStorage.setItem('nonActiveTasks', JSON.stringify(this.nonActiveTasks));
		}
		toList.appendChild(item);
		this.toggleEmptyListMessage();
	}

	//при загрузке имеющиеся в харнилище объекты парсятся в соответствующие списки
	checkTasksInStorage = (tasks, list) => {
		if(window.localStorage.getItem(tasks)){
			this[tasks] = JSON.parse(window.localStorage.getItem(tasks));
			for(let key in this[tasks]){
				this.createItem(this[tasks][key], list, this[tasks], key);
			}
		}
	}
};

new List();