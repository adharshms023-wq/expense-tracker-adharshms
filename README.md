# 💰 Ledger — Personal Expense Tracker

A simple, responsive **Personal Expense Tracker** built using HTML, CSS, and JavaScript.

Ledger helps you keep track of your **income, expenses, and current balance** in one place. All transaction data is stored locally in your browser using **LocalStorage**, so no backend or database is required.

## 🚀 Live Demo

👉 **Live Demo:** Add your deployed website link here

👉 **GitHub Repository:**  
https://github.com/adharshms023-wq/expense-tracker-adharshms

---

## ✨ Features

- 💰 Track income and expenses
- 📊 Automatically calculate:
  - Current balance
  - Total income
  - Total expenses
- ➕ Add new transactions
- ✏️ Edit existing transactions
- 🗑️ Delete transactions with confirmation
- 🏷️ Categorize transactions
- 🔎 Search transactions
- 🔽 Filter transactions by:
  - All
  - Income
  - Expense
  - Category
- 📅 Select transaction dates
- 🇮🇳 Indian Rupee (₹) currency formatting
- 💾 Persistent data using LocalStorage
- 📱 Responsive user interface
- ✅ Form validation
- 🔔 Success and error notifications

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)

### Browser APIs

- LocalStorage API
- HTML `<dialog>` element
- Intl.NumberFormat API

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## 📂 Project Structure

```text
expense-tracker-adharshms/
│
├── index.html       # Main application structure
├── style.css        # Styling and responsive design
├── script.js        # Application logic
└── README.md        # Project documentation
```

---

## 🖥️ Application Overview

The application dashboard displays three important financial values:

```text
┌─────────────────────────────────────────┐
│              LEDGER                     │
│        Your money, at a glance          │
│                                         │
│  Current Balance   Total Income        │
│       ₹0               ₹0              │
│                                         │
│            Total Expenses               │
│                  ₹0                     │
└─────────────────────────────────────────┘
```

Users can then add and manage their transactions from the transaction section.

---

## ➕ Adding a Transaction

Click the **Add Transaction** button to open the transaction form.

You can enter:

| Field | Description |
|---|---|
| Type | Income or Expense |
| Amount | Transaction amount in ₹ |
| Category | Select a relevant category |
| Date | Date of the transaction |
| Description | Short description of the transaction |

### Income Categories

- Salary
- Freelance
- Business
- Investment
- Other

### Expense Categories

- Food
- Transport
- Shopping
- Bills
- Entertainment
- Education
- Health
- Rent
- Other

---

## 📊 Balance Calculation

The current balance is automatically calculated using:

```text
Current Balance = Total Income − Total Expenses
```

For example:

```text
Income       ₹30,000
Expenses     ₹12,000
--------------------
Balance      ₹18,000
```

The dashboard updates automatically whenever a transaction is added, edited, or deleted.

---

## 🔎 Search & Filtering

Transactions can be quickly located using the search box.

You can search by:

- Description
- Category
- Amount

You can also filter transactions by:

- All transactions
- Income
- Expenses
- Individual categories

This makes it easier to find specific transactions.

---

## ✏️ Edit Transactions

Every transaction includes an **Edit** option.

Clicking Edit opens the transaction form with the existing information already filled in.

You can then modify:

- Transaction type
- Amount
- Category
- Date
- Description

After saving, the dashboard and transaction list are updated automatically.

---

## 🗑️ Delete Transactions

Transactions can be removed using the **Delete** button.

Before deletion, the application displays a confirmation dialog to prevent accidental removal.

> Deleted transactions cannot be recovered.

---

## 💾 Data Storage

This application does **not require a backend or database**.

Transaction data is stored in the browser using:

```javascript
localStorage
```

The application saves transactions locally and loads them again when the application is opened.

### How it works

```text
Add Transaction
       ↓
JavaScript
       ↓
LocalStorage
       ↓
Browser Storage
       ↓
Reload Website
       ↓
Transactions Restored
```

### Important

Because the data is stored in browser LocalStorage:

- Data is specific to the browser/device.
- Data is not synchronized between devices.
- Clearing browser storage can remove the saved transactions.
- There is currently no cloud backup.

---

# 🖥️ How to Run the Project Locally

## Method 1 — Clone with Git

Make sure **Git** is installed on your computer.

Open your terminal or command prompt and run:

```bash
git clone https://github.com/adharshms023-wq/expense-tracker-adharshms.git
```

Move into the project directory:

```bash
cd expense-tracker-adharshms
```

Then open the project in Visual Studio Code:

```bash
code .
```

---

## Method 2 — Download ZIP

You can also download the project directly from GitHub.

1. Open the repository.
2. Click **Code**.
3. Select **Download ZIP**.
4. Extract the ZIP file.
5. Open the extracted folder in Visual Studio Code.

---

# ▶️ Running the Application

This project does not require:

- Node.js
- npm
- MongoDB
- Express
- React
- Backend server
- Environment variables

You can simply open:

```text
index.html
```

in your web browser.

### Recommended Method — VS Code Live Server

For a better development experience:

1. Install **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Open the project folder.
4. Right-click `index.html`.
5. Select **Open with Live Server**.

The application will open in your browser.

---

## 🌐 Deploying the Project

Since this is a static HTML/CSS/JavaScript application, it can easily be deployed using services such as:

- GitHub Pages
- Vercel
- Netlify

No backend deployment is required.

### GitHub Pages

You can deploy it directly from the GitHub repository:

```text
Repository
    ↓
Settings
    ↓
Pages
    ↓
Deploy from branch
    ↓
main
    ↓
/ (root)
    ↓
Save
```

After deployment, GitHub will provide a public URL for the application.

---

# 🧠 JavaScript Concepts Used

This project demonstrates several important JavaScript concepts.

### DOM Manipulation

```javascript
document.getElementById()
```

Used to access and update elements on the webpage.

### Arrays

Transactions are maintained inside a JavaScript array.

```javascript
let transactions = [];
```

### Array Methods

The project uses methods such as:

```javascript
map()
filter()
reduce()
sort()
find()
```

### Objects

Each transaction is represented as an object:

```javascript
{
    id: 123456789,
    type: "expense",
    amount: 500,
    category: "Food",
    date: "2026-10-05",
    description: "Lunch"
}
```

### LocalStorage

```javascript
localStorage.setItem()
localStorage.getItem()
```

Used to save and retrieve transaction data.

### JSON

```javascript
JSON.stringify()
JSON.parse()
```

Used to convert transaction data for LocalStorage.

### Event Handling

The application uses JavaScript event listeners to handle:

- Form submission
- Button clicks
- Searching
- Filtering
- Editing
- Deleting
- Transaction type changes

---

# 🔐 Privacy

Ledger stores transaction information locally in the browser.

No transaction data is sent to a remote server because this version of the application does not use a backend or cloud database.

However, users should remember that browser LocalStorage can be cleared by browser settings or by clearing site data.

---

# 🚧 Future Improvements

Possible improvements for future versions include:

- 🌙 Dark mode
- 📊 Expense charts and analytics
- 📅 Monthly and yearly reports
- 💰 Budget management
- 📥 Export transactions to CSV
- 📤 Import transactions
- ☁️ Cloud synchronization
- 🔐 User authentication
- 📱 Progressive Web App (PWA)
- 🔔 Budget notifications
- 📈 Spending insights
- 💳 Multiple accounts
- 🔄 Cross-device synchronization

---

# 🎯 Learning Objectives

This project was created to practice and demonstrate:

- HTML structure
- CSS responsive design
- JavaScript DOM manipulation
- JavaScript arrays and objects
- Array methods
- Event handling
- Form validation
- LocalStorage
- JSON data handling
- CRUD operations
- Search and filtering
- Responsive UI development

---

# 👨‍💻 Author

**Adharsh M S**

GitHub:  
https://github.com/adharshms023-wq

---

## ⭐ Contributing

Contributions, suggestions, and improvements are welcome.

If you would like to contribute:

```bash
# Fork the repository

# Clone your fork
git clone https://github.com/your-username/expense-tracker-adharshms.git

# Create a new branch
git checkout -b feature/improvement

# Make your changes

# Commit your changes
git add .
git commit -m "Add new improvement"

# Push your branch
git push origin feature/improvement
```

Then open a Pull Request.

---

## 📄 License

This project is open for learning and personal use.

---

⭐ **If you found this project useful, consider giving the repository a star!**
