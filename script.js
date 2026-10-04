/**
 * Daily Task Tracker - Core Logic & DOM Handlers
 */

// ==========================================
// 1. Pure Helper Functions (Logic & Testing)
// ==========================================

/**
 * Validates the task input string.
 * @param {string} taskText 
 * @returns {{ valid: boolean, message?: string, cleanedText?: string }}
 */
function validateTask(taskText) {
    if (taskText === null || taskText === undefined) {
        return { valid: false, message: "Task cannot be empty. Please enter a task!" };
    }

    const trimmed = typeof taskText === "string" ? taskText.trim() : "";
    if (trimmed.length === 0) {
        return { valid: false, message: "Task cannot be empty. Please enter a task!" };
    }

    if (trimmed.length > 200) {
        return { valid: false, message: "Task is too long (maximum 200 characters)." };
    }

    return { valid: true, cleanedText: trimmed };
}

/**
 * Creates a new task item object.
 * @param {string} text 
 * @param {string|number} [id] 
 * @param {boolean} [completed=false] 
 * @returns {object}
 */
function createTaskItem(text, id, completed = false) {
    return {
        id: id || Date.now().toString(),
        text: text.trim(),
        completed: Boolean(completed),
        createdAt: new Date().toISOString()
    };
}

/**
 * Adds a new task to a task list immutably.
 * @param {Array} taskList 
 * @param {string} taskText 
 * @returns {{ success: boolean, tasks: Array, error?: string, newTask?: object }}
 */
function addTask(taskList, taskText) {
    const validation = validateTask(taskText);
    if (!validation.valid) {
        return { success: false, tasks: [...(taskList || [])], error: validation.message };
    }

    const newTask = createTaskItem(validation.cleanedText);
    const updatedTasks = [newTask, ...(taskList || [])];
    return { success: true, tasks: updatedTasks, newTask };
}

/**
 * Toggles the completion status of a task by id.
 * @param {Array} taskList 
 * @param {string|number} taskId 
 * @returns {Array}
 */
function toggleTask(taskList, taskId) {
    if (!Array.isArray(taskList)) return [];
    return taskList.map(task => {
        if (String(task.id) === String(taskId)) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
}

/**
 * Deletes a task by id from a task list.
 * @param {Array} taskList 
 * @param {string|number} taskId 
 * @returns {Array}
 */
function deleteTask(taskList, taskId) {
    if (!Array.isArray(taskList)) return [];
    return taskList.filter(task => String(task.id) !== String(taskId));
}

/**
 * Clears all completed tasks from the list.
 * @param {Array} taskList 
 * @returns {Array}
 */
function clearCompletedTasks(taskList) {
    if (!Array.isArray(taskList)) return [];
    return taskList.filter(task => !task.completed);
}

/**
 * Clears all tasks from the list.
 * @returns {Array}
 */
function clearAllTasks() {
    return [];
}

/**
 * Filters tasks based on status ('all', 'active', 'completed').
 * @param {Array} taskList 
 * @param {string} filter 
 * @returns {Array}
 */
function filterTasks(taskList, filter = "all") {
    if (!Array.isArray(taskList)) return [];
    switch (filter) {
        case "active":
            return taskList.filter(t => !t.completed);
        case "completed":
            return taskList.filter(t => t.completed);
        case "all":
        default:
            return taskList;
    }
}

/**
 * Computes task statistics (total, completed, pending, progress percentage).
 * @param {Array} taskList 
 * @returns {{ total: number, completed: number, pending: number, percent: number }}
 */
function getTaskStats(taskList) {
    if (!Array.isArray(taskList) || taskList.length === 0) {
        return { total: 0, completed: 0, pending: 0, percent: 0 };
    }
    const total = taskList.length;
    const completed = taskList.filter(t => t.completed).length;
    const pending = total - completed;
    const percent = Math.round((completed / total) * 100);
    return { total, completed, pending, percent };
}

// ==========================================
// 2. DOM & UI Management (Browser Context)
// ==========================================

if (typeof window !== "undefined" && typeof document !== "undefined") {
    // Application State
    let tasks = [];
    let currentFilter = "all";

    // Storage Key
    const STORAGE_KEY = "daily_task_tracker_tasks";

    // DOM Elements
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const errorMessage = document.getElementById("errorMessage");
    const taskListElement = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");
    const totalCountEl = document.getElementById("totalCount");
    const pendingCountEl = document.getElementById("pendingCount");
    const completedCountEl = document.getElementById("completedCount");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    const clearCompletedBtn = document.getElementById("clearCompletedBtn");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const currentDateEl = document.getElementById("currentDate");

    // Initialize Application
    function init() {
        loadTasks();
        renderCurrentDate();
        setupEventListeners();
        render();
    }

    // Load tasks from LocalStorage
    function loadTasks() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            tasks = saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Error loading tasks from localStorage:", e);
            tasks = [];
        }
    }

    // Save tasks to LocalStorage
    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error("Error saving tasks to localStorage:", e);
        }
    }

    // Display Current Date
    function renderCurrentDate() {
        if (currentDateEl) {
            const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
            currentDateEl.textContent = new Date().toLocaleDateString(undefined, options);
        }
    }

    // Show Error Message
    function showError(msg) {
        if (!errorMessage) return;
        errorMessage.textContent = msg;
        errorMessage.classList.remove("hidden");
        
        // Auto-hide error after 4 seconds
        setTimeout(() => {
            clearError();
        }, 4000);
    }

    // Clear Error Message
    function clearError() {
        if (!errorMessage) return;
        errorMessage.textContent = "";
        errorMessage.classList.add("hidden");
    }

    // Handle Add Task Submission
    function handleAddTask() {
        if (!taskInput) return;
        const text = taskInput.value;
        const result = addTask(tasks, text);

        if (!result.success) {
            showError(result.error);
            taskInput.focus();
            return;
        }

        clearError();
        tasks = result.tasks;
        taskInput.value = "";
        saveTasks();
        render();
        taskInput.focus();
    }

    // Handle Task Toggle
    function handleToggleTask(id) {
        tasks = toggleTask(tasks, id);
        saveTasks();
        render();
    }

    // Handle Task Deletion
    function handleDeleteTask(id) {
        tasks = deleteTask(tasks, id);
        saveTasks();
        render();
    }

    // Setup Event Listeners
    function setupEventListeners() {
        if (addTaskBtn) {
            addTaskBtn.addEventListener("click", handleAddTask);
        }

        if (taskInput) {
            taskInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    handleAddTask();
                } else {
                    clearError();
                }
            });
        }

        if (clearCompletedBtn) {
            clearCompletedBtn.addEventListener("click", () => {
                if (tasks.some(t => t.completed)) {
                    tasks = clearCompletedTasks(tasks);
                    saveTasks();
                    render();
                }
            });
        }

        if (clearAllBtn) {
            clearAllBtn.addEventListener("click", () => {
                if (tasks.length > 0 && confirm("Are you sure you want to clear all tasks?")) {
                    tasks = clearAllTasks();
                    saveTasks();
                    render();
                }
            });
        }

        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.dataset.filter || "all";
                render();
            });
        });
    }

    // Render the entire UI
    function render() {
        renderStats();
        renderTasks();
    }

    // Render Stats
    function renderStats() {
        const stats = getTaskStats(tasks);
        if (totalCountEl) totalCountEl.textContent = stats.total;
        if (pendingCountEl) pendingCountEl.textContent = stats.pending;
        if (completedCountEl) completedCountEl.textContent = stats.completed;
        if (progressBar) progressBar.style.width = `${stats.percent}%`;
        if (progressPercent) progressPercent.textContent = `${stats.percent}%`;
    }

    // Render Task List
    function renderTasks() {
        if (!taskListElement) return;

        const filtered = filterTasks(tasks, currentFilter);
        taskListElement.innerHTML = "";

        if (filtered.length === 0) {
            if (emptyState) emptyState.classList.remove("hidden");
            return;
        }

        if (emptyState) emptyState.classList.add("hidden");

        filtered.forEach(task => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? "completed" : ""}`;
            li.dataset.id = task.id;

            // Checkbox/Toggle button
            const checkBtn = document.createElement("button");
            checkBtn.className = `task-checkbox ${task.completed ? "checked" : ""}`;
            checkBtn.setAttribute("aria-label", task.completed ? "Mark incomplete" : "Mark complete");
            checkBtn.innerHTML = task.completed
                ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
                : "";
            checkBtn.addEventListener("click", () => handleToggleTask(task.id));

            // Task text
            const span = document.createElement("span");
            span.className = "task-text";
            span.textContent = task.text;
            span.addEventListener("click", () => handleToggleTask(task.id));

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "task-delete-btn";
            deleteBtn.setAttribute("aria-label", "Delete task");
            deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                handleDeleteTask(task.id);
            });

            li.appendChild(checkBtn);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskListElement.appendChild(li);
        });
    }

    // Run on DOM load
    document.addEventListener("DOMContentLoaded", init);
}

// Export for Node.js Unit Testing
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validateTask,
        createTaskItem,
        addTask,
        toggleTask,
        deleteTask,
        clearCompletedTasks,
        clearAllTasks,
        filterTasks,
        getTaskStats
    };
}
