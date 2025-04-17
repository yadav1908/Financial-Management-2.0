 // Initial data setup
 const budgets = {
    food: 500,
    transportation: 300,
    entertainment: 200,
    housing: 1000,
    utilities: 250,
    other: 300
};

// Initialize app state or load from localStorage
let appState = {
    balance: 2500,
    transactions: [],
    spending: {
        food: 0,
        transportation: 0,
        entertainment: 0,
        housing: 0,
        utilities: 0,
        other: 0
    },
    income: 0,
    expenses: 0
};

// DOM Elements
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const transactionForm = document.getElementById('transaction-form');
const transactionTableBody = document.getElementById('transactions-table-body');
const summaryIncomeEl = document.getElementById('summary-income');
const summaryExpensesEl = document.getElementById('summary-expenses');
const summarySavingsEl = document.getElementById('summary-savings');
const topCategoryEl = document.getElementById('top-category');

// Set today's date as default
document.getElementById('transaction-date').valueAsDate = new Date();

// Load data from localStorage
function loadData() {
    const savedState = localStorage.getItem('financialDashboardState');
    if (savedState) {
        appState = JSON.parse(savedState);
        updateUI();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('financialDashboardState', JSON.stringify(appState));
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Update UI elements with current state
function updateUI() {
    // Update balance
    balanceEl.textContent = formatCurrency(appState.balance);
    if (appState.balance < 0) {
        balanceEl.classList.add('negative');
    } else {
        balanceEl.classList.remove('negative');
    }
    
    // Update income and expenses summary
    totalIncomeEl.textContent = formatCurrency(appState.income);
    totalExpensesEl.textContent = formatCurrency(appState.expenses);
    
    // Update monthly summary
    summaryIncomeEl.textContent = formatCurrency(appState.income);
    summaryExpensesEl.textContent = formatCurrency(appState.expenses);
    summarySavingsEl.textContent = formatCurrency(appState.income - appState.expenses);
    
    // Update top spending category
    const categories = Object.keys(appState.spending);
    const topCategory = categories.reduce((max, category) => 
        appState.spending[category] > appState.spending[max] ? category : max, categories[0]
    );
    
    if (appState.spending[topCategory] > 0) {
        topCategoryEl.textContent = topCategory.charAt(0).toUpperCase() + topCategory.slice(1);
    } else {
        topCategoryEl.textContent = 'None';
    }
    
    // Update budget bars
    updateBudgetBars();
    
    // Update transactions table
    renderTransactions();
}

// Update budget progress bars
// Update budget progress bars and check for budget limit
function updateBudgetBars() {
    Object.keys(budgets).forEach(category => {
        const spent = appState.spending[category];
        const budget = budgets[category];
        const percentage = (spent / budget) * 100;

        // Update progress bar
        const progressBar = document.getElementById(`${category}-progress`);
        progressBar.style.width = `${Math.min(percentage, 100)}%`;

        // Add warning or danger classes
        if (percentage >= 90) {
            progressBar.classList.add('danger');
            progressBar.classList.remove('warning');
        } else if (percentage >= 75) {
            progressBar.classList.add('warning');
            progressBar.classList.remove('danger');
        } else {
            progressBar.classList.remove('warning', 'danger');
        }

        // Update text
        document.getElementById(`${category}-budget-text`).textContent = 
            `${formatCurrency(spent)}/${formatCurrency(budget)}`;

        // Check if the spending exceeds the budget
        if (spent >= budget) {
            showBudgetWarning(category, spent, budget);
        }
    });
}

// new function 

// Function to display a popup warning when a category exceeds its budget
function showBudgetWarning(category, spent, budget) {
    // Create the warning message
    const message = `Warning: You have exceeded the budget for ${category.charAt(0).toUpperCase() + category.slice(1)}. You have spent ${formatCurrency(spent)} out of ${formatCurrency(budget)}.`;

    // Show the popup (Alert in this case)
    alert(message);  // You can replace this with a custom modal if you prefer
}


// Render transactions table
function renderTransactions() {
    transactionTableBody.innerHTML = '';
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...appState.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show only the 10 most recent transactions
    const recentTransactions = sortedTransactions.slice(0, 10);
    
    recentTransactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create the row content
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.description}</td>
            <td>${transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}</td>
            <td class="transaction-amount ${transaction.type === 'income' ? 'transaction-income' : 'transaction-expense'}">
                ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(Math.abs(transaction.amount))}
            </td>
            <td class="transaction-actions">
                <button class="delete-btn" data-index="${index}">×</button>
            </td>
        `;
        
        transactionTableBody.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteTransaction);
    });
}

// Add a new transaction
function addTransaction(e) {
    e.preventDefault();
    
    const description = document.getElementById('transaction-description').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const type = document.getElementById('transaction-type').value;
    const category = document.getElementById('transaction-category').value;
    const date = document.getElementById('transaction-date').value;
    
    if (!description || !amount || !date) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create transaction object
    const transaction = {
        description,
        amount,
        type,
        category,
        date
    };
    
    // Update app state
    appState.transactions.push(transaction);
    
    // Update balance
    if (type === 'income') {
        appState.balance += amount;
        appState.income += amount;
    } else {
        appState.balance -= amount;
        appState.expenses += amount;
        appState.spending[category] += amount;
    }
    
    // Save and update UI
    saveData();
    updateUI();
    
    // Reset form
    transactionForm.reset();
    document.getElementById('transaction-date').valueAsDate = new Date();
}

// Delete a transaction
function handleDeleteTransaction(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const transaction = appState.transactions[index];
    
    if (transaction) {
        // Confirm deletion
        if (confirm(`Are you sure you want to delete the transaction: "${transaction.description}"?`)) {
            // Revert balance changes
            if (transaction.type === 'income') {
                appState.balance -= transaction.amount;
                appState.income -= transaction.amount;
            } else {
                appState.balance += transaction.amount;
                appState.expenses -= transaction.amount;
                appState.spending[transaction.category] -= transaction.amount;
            }
            
            // Remove the transaction
            appState.transactions.splice(index, 1);
            
            // Save and update UI
            saveData();
            updateUI();
        }
    }
}

// Event Listeners
transactionForm.addEventListener('submit', addTransaction);

// Type change handler (show/hide category)
document.getElementById('transaction-type').addEventListener('change', function() {
    const categoryGroup = document.getElementById('transaction-category').parentElement;
    if (this.value === 'income') {
        categoryGroup.style.display = 'none';
    } else {
        categoryGroup.style.display = 'block';
    }
});

// Initialize the app
function init() {
    loadData();
    
    // Set initial visibility of category field
    const transactionType = document.getElementById('transaction-type');
    if (transactionType.value === 'income') {
        document.getElementById('transaction-category').parentElement.style.display = 'none';
    }
}

// Start the app
init();