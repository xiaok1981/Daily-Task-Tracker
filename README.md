# Daily Task Tracker 📝

A modern, fast, and responsive Daily Task Tracker web application built from scratch with Vanilla HTML5, CSS3, and JavaScript (ES6+), featuring automated testing, continuous integration (CI), and continuous deployment (CD) with GitHub Actions and GitHub Pages.

---

## 🚀 Live Demo & Workflow

- **Live GitHub Pages URL**: `https://<your-username>.github.io/<repository-name>/`
- **CI / CD Pipeline**: Automated tests run on every Pull Request and push to `main`. Passing builds automatically deploy to GitHub Pages.

---

## ✨ Features

- **Add Tasks**: Quickly add tasks with interactive validation (empty tasks are rejected with a helpful warning message).
- **Task Counter & Real-Time Stats**: Displays total count, pending tasks, completed tasks, and a dynamic progress bar.
- **Toggle Completion**: Mark tasks completed with animated checkboxes and strike-through styling.
- **Delete Tasks**: Remove individual tasks anytime.
- **Filter Tasks**: Toggle between **All**, **Active**, and **Completed** views.
- **Bulk Actions**: Clear completed tasks or clear all tasks at once.
- **LocalStorage Persistence**: All tasks stay saved in your browser across sessions.
- **Modern UI / UX**: Deep dark mode theme, glassmorphism cards, vibrant gradients, and smooth micro-animations.

---

## 🧪 Automated Testing

Automated tests are written with Node.js built-in test runner (`node:test` and `node:assert`).

### Run Tests Locally
```bash
npm test
```

### Test Suite Highlights
- **Valid Task**: Verifies task creation and text trimming.
- **Empty Task**: Rejects empty strings, whitespace-only inputs, and null/undefined values.
- **Toggle Task**: Confirms completion status toggling.
- **Delete Task**: Confirms task removal by ID.
- **Filters**: Tests filtering for `all`, `active`, and `completed`.
- **Statistics**: Calculates total, completed, pending, and progress percentage.

---

## 🛠 Complete Git & GitHub CI/CD Workflow

### Step 1: Initialize Git and Create Initial Commit on `main`
```bash
# Navigate to the project folder
cd /Users/tengma/Desktop/python/Frontend/daily_task_track

# Initialize git repository
git init -b main

# Add all project files
git add .

# Commit files
git commit -m "feat: initial daily task tracker project setup with CI/CD"
```

### Step 2: Create a Feature Branch
```bash
# Create and switch to a feature branch
git checkout -b feature/task-tracker-enhancements

# Make any enhancement or edit, then commit
git add .
git commit -m "feat: add task filtering, statistics bar, and automated unit tests"
```

### Step 3: Push to GitHub & Create a Pull Request
```bash
# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/<your-username>/daily_task_track.git

# Push the main branch
git push -u origin main

# Push the feature branch
git push -u origin feature/task-tracker-enhancements
```

1. Go to your repository on GitHub.
2. Click **Compare & pull request** for `feature/task-tracker-enhancements` against `main`.
3. GitHub Actions **CI** will automatically trigger and run all tests.
4. Once tests pass (✅ green checkmark), merge the Pull Request into `main`.

### Step 4: Configure GitHub Pages for CD Deployment
1. In your GitHub repository, navigate to **Settings** → **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. When you merge into `main`, `.github/workflows/cd.yml` will automatically deploy the site.
4. Your site will be live at:
   `https://<your-username>.github.io/daily_task_track/`

---

## 📂 Project Structure

```text
daily_task_track/
├── .github/
│   └── workflows/
│       ├── ci.yml          # GitHub Actions CI (Runs npm test on PR & push)
│       └── cd.yml          # GitHub Actions CD (Deploys to GitHub Pages)
├── test/
│   └── task.test.js        # Automated unit tests (12 tests)
├── .gitignore              # Git ignore rules
├── index.html              # Main HTML structure
├── package.json            # Node package config & test script
├── README.md               # Project documentation & workflow guide
├── script.js               # Core task logic & UI event handlers
└── style.css               # Modern design styling & animations
```

---

## 📜 License
ISC
