class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        
        // DOM Elements
        this.form = document.getElementById('todo-form');
        this.taskInput = document.getElementById('task-input');
        this.categorySelect = document.getElementById('category-select');
        this.prioritySelect = document.getElementById('priority-select');
        this.dueDateInput = document.getElementById('due-date');
        this.tasksContainer = document.getElementById('tasks-container');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.totalTasksSpan = document.getElementById('total-tasks');
        this.completedTasksSpan = document.getElementById('completed-tasks');

        this.initializeEventListeners();
        this.renderTasks();
        this.updateSummary();
    }

    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.filter;
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderTasks();
            });
        });
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            category: this.categorySelect.value,
            priority: this.prioritySelect.value,
            dueDate: this.dueDateInput.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateSummary();
        
        // Reset form
        this.form.reset();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateSummary();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateSummary();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        this.tasksContainer.innerHTML = filteredTasks.map(task => `
            <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}">
                <button class="task-btn complete-btn" onclick="todoApp.toggleTask(${task.id})">
                    <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                </button>
                
                <div class="task-content">
                    <div class="task-text">${task.text}</div>
                    <div class="task-details">
                        ${task.category} • Priority: ${task.priority}
                        ${task.dueDate ? ` • Due: ${this.formatDate(task.dueDate)}` : ''}
                    </div>
                </div>

                <button class="task-btn delete-btn" onclick="todoApp.deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    updateSummary() {
        this.totalTasksSpan.textContent = this.tasks.length;
        this.completedTasksSpan.textContent = this.tasks.filter(t => t.completed).length;
    }
}

// Initialize the app
const todoApp = new TodoApp();
