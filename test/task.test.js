const test = require("node:test");
const assert = require("node:assert");

const {
    validateTask,
    createTaskItem,
    addTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
    clearAllTasks,
    filterTasks,
    getTaskStats
} = require("../script");

// 1. Valid Task Tests
test("Valid task validation returns valid: true", () => {
    const result = validateTask("Complete CI/CD workflow");
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.cleanedText, "Complete CI/CD workflow");
});

test("Add valid task to task list", () => {
    const initialTasks = [];
    const result = addTask(initialTasks, "Write automated tests");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.tasks.length, 1);
    assert.strictEqual(result.tasks[0].text, "Write automated tests");
    assert.strictEqual(result.tasks[0].completed, false);
});

// 2. Empty Task Tests
test("Empty task validation returns valid: false with error message", () => {
    const result = validateTask("");
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.message, "Task cannot be empty. Please enter a task!");
});

test("Whitespace-only task is rejected as empty", () => {
    const result = validateTask("    ");
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.message, "Task cannot be empty. Please enter a task!");
});

test("Null or undefined task is rejected", () => {
    const nullResult = validateTask(null);
    const undefinedResult = validateTask(undefined);
    assert.strictEqual(nullResult.valid, false);
    assert.strictEqual(undefinedResult.valid, false);
});

test("Adding empty task does not modify task list", () => {
    const initialTasks = [{ id: "1", text: "Existing Task", completed: false }];
    const result = addTask(initialTasks, "   ");
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.tasks.length, 1);
});

// 3. Additional Enhancement Tests
test("Toggle task completion status", () => {
    const tasks = [
        { id: "101", text: "Setup GitHub Actions", completed: false },
        { id: "102", text: "Deploy to GitHub Pages", completed: true }
    ];

    // Toggle false to true
    const toggled1 = toggleTask(tasks, "101");
    assert.strictEqual(toggled1[0].completed, true);

    // Toggle true to false
    const toggled2 = toggleTask(tasks, "102");
    assert.strictEqual(toggled2[1].completed, false);
});

test("Delete task removes the task with matching id", () => {
    const tasks = [
        { id: "1", text: "Task One", completed: false },
        { id: "2", text: "Task Two", completed: false },
        { id: "3", text: "Task Three", completed: false }
    ];

    const result = deleteTask(tasks, "2");
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result.find(t => t.id === "2"), undefined);
});

test("Filter tasks by active and completed status", () => {
    const tasks = [
        { id: "1", text: "Task A", completed: false },
        { id: "2", text: "Task B", completed: true },
        { id: "3", text: "Task C", completed: false }
    ];

    const all = filterTasks(tasks, "all");
    const active = filterTasks(tasks, "active");
    const completed = filterTasks(tasks, "completed");

    assert.strictEqual(all.length, 3);
    assert.strictEqual(active.length, 2);
    assert.strictEqual(completed.length, 1);
    assert.strictEqual(completed[0].id, "2");
});

test("Clear completed tasks removes only completed items", () => {
    const tasks = [
        { id: "1", text: "Task 1", completed: false },
        { id: "2", text: "Task 2", completed: true },
        { id: "3", text: "Task 3", completed: true }
    ];

    const remaining = clearCompletedTasks(tasks);
    assert.strictEqual(remaining.length, 1);
    assert.strictEqual(remaining[0].id, "1");
});

test("Clear all tasks returns an empty array", () => {
    const result = clearAllTasks();
    assert.deepStrictEqual(result, []);
});

test("Task statistics calculation returns correct counts and percentage", () => {
    const tasks = [
        { id: "1", text: "Task 1", completed: true },
        { id: "2", text: "Task 2", completed: true },
        { id: "3", text: "Task 3", completed: false },
        { id: "4", text: "Task 4", completed: false }
    ];

    const stats = getTaskStats(tasks);
    assert.strictEqual(stats.total, 4);
    assert.strictEqual(stats.completed, 2);
    assert.strictEqual(stats.pending, 2);
    assert.strictEqual(stats.percent, 50);
});
