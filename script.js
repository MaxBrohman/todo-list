class List{
  constructor(){
	this.todoList = document.querySelector('.todo-list');
	this.doneList = document.querySelector('.todo-list.done');
    this.items = this.todoList.children;
    this.newItem = document.querySelector('#task-template').content.querySelector('.todo-list-item');
	this.emptyListMessage = document.querySelector('.empty-tasks');
	this.addTask = document.querySelector('.add-form');
	this.taskInput = this.addTask.querySelector('.add-form-input');
	this.addTask.addEventListener('submit', (evt) => {
		evt.preventDefault();
		let newItem = this.newItem.cloneNode(true);
		newItem.querySelector('span').textContent = this.taskInput.value;
		this.addCheckHandler(newItem);
		newItem = this.todoList.appendChild(newItem);
		this.toggleEmptyListMessage();
		this.taskInput.value = '';
	});
  }

  _isEmpty = () => this.items.length === 0;

  toggleEmptyListMessage = () => {
    this._isEmpty() ? this.emptyListMessage.classList.remove('hidden') : this.emptyListMessage.classList.add('hidden');
  }

  addCheckHandler = (item) => {
	const input = item.querySelector('input');
	input.addEventListener('change', () => {
		if(input.checked){
			const removedItem = this.todoList.removeChild(item);
			removedItem.classList.add('done');
			this.doneList.appendChild(removedItem);
			this.toggleEmptyListMessage();
		} else{
			const removedItem = this.doneList.removeChild(item);
			removedItem.classList.remove('done');
			this.todoList.appendChild(removedItem);
			this.toggleEmptyListMessage();
		}
	});
  }

};
new List();