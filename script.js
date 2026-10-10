const addExpenseButton = document.getElementById("addExpense");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseList = document.getElementById("expenseList");
const totalExpense = document.getElementById("totalExpense");
const allTransactionsList = document.getElementById("allTransactionsList");
const transactionCount = document.getElementById("transactionCount");
let total = 0;
const totalIncome = document.getElementById("totalIncome");
const incomeAmountInput = document.getElementById("incomeAmount");
const addIncomeButton = document.getElementById("addIncome");
const editIncomeButton = document.getElementById("editIncome");
const balanceDisplay = document.getElementById("balance");

let totalIncomeAmount = Number(localStorage.getItem("totalIncomeAmount")) || 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}
let isLoadingExpenses = false;
function addExpense() {
    const name = expenseNameInput.value.trim();
    const amountText = expenseAmountInput.value;
    const amount = Number(amountText);

    if (name === "" || amountText === "" || !Number.isFinite(amount) || amount <= 0) {
        return;
    }

    total += amount;
    totalExpense.textContent = total.toLocaleString("vi-VN") + "đ";
    updateBalance();
    const overviewItem = document.createElement("li");
    const transactionItem = document.createElement("li");

    overviewItem.appendChild(document.createTextNode(name + " - " + amount.toLocaleString("vi-VN") + "đ "));
    transactionItem.appendChild(document.createTextNode(name + " - " + amount.toLocaleString("vi-VN") + "đ "));

    const deleteOverview = document.createElement("button");
    deleteOverview.textContent = "Xóa";

    const deleteTransaction = document.createElement("button");
    deleteTransaction.textContent = "Xóa";

    function deleteExpense() {
        total -= amount;
        expenses = expenses.filter(function(expense) {
        return !(expense.name === name && expense.amount === amount);
    });
    saveExpenses();
        totalExpense.textContent = total.toLocaleString("vi-VN") + "đ";
        updateBalance();
        overviewItem.remove();
        transactionItem.remove();
        transactionCount.textContent = allTransactionsList.children.length + " khoản";
        updateStatistics();
    }
    deleteOverview.addEventListener("click", deleteExpense);
    deleteTransaction.addEventListener("click", deleteExpense);
    overviewItem.appendChild(deleteOverview);
    transactionItem.appendChild(deleteTransaction);
    expenseList.appendChild(overviewItem);
    allTransactionsList.appendChild(transactionItem);
    transactionCount.textContent = allTransactionsList.children.length + " khoản";
    if (!isLoadingExpenses) {
    expenses.push({
        name: name,
        amount: amount
    });
    saveExpenses();
}
    expenseNameInput.value = "";
    expenseAmountInput.value = "";
    transactionCount.textContent = allTransactionsList.children.length + " khoản";
    updateStatistics();
}
addExpenseButton.addEventListener("click", addExpense);

const modalExpenseName = document.getElementById("modalExpenseName");
const modalExpenseAmount = document.getElementById("modalExpenseAmount");
const modalAddExpense = document.getElementById("modalAddExpense");
const closeExpenseModal = document.getElementById("closeExpenseModal");

modalAddExpense.addEventListener("click", function() {
    expenseNameInput.value = modalExpenseName.value;
    expenseAmountInput.value = modalExpenseAmount.value;

    addExpense();

    if (expenseNameInput.value === "" && expenseAmountInput.value === "") {
        modalExpenseName.value = "";
        modalExpenseAmount.value = "";
        expenseModal.style.display = "none";
    }
});

closeExpenseModal.addEventListener("click", function() {
    expenseModal.style.display = "none";
});

expenseAmountInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addExpense();
    }
});

const openExpenseModal = document.getElementById("openExpenseModal");
const expenseModal = document.getElementById("expenseModal");

openExpenseModal.addEventListener("click", function() {
    expenseModal.style.display = "flex";
});
expenseModal.addEventListener("click", function(event) {
    if (event.target === expenseModal) {
        expenseModal.style.display = "none";
    }
});

const navItems = document.querySelectorAll(".nav-item");

const dashboardPage = document.querySelector(".dashboard");
const transactionsPage = document.getElementById("transactionsPage");
const statisticsPage = document.getElementById("statisticsPage");
const settingsPage = document.getElementById("settingsPage");

navItems.forEach(function(item) {
    item.addEventListener("click", function(event) {
        event.preventDefault();

        navItems.forEach(function(navItem) {
            navItem.classList.remove("active");
        });

        item.classList.add("active");

        dashboardPage.hidden = true;
        transactionsPage.hidden = true;
        statisticsPage.hidden = true;
        settingsPage.hidden = true;

        if (item.dataset.page === "overview") {
            dashboardPage.hidden = false;
        } else if (item.dataset.page === "transactions") {
            transactionsPage.hidden = false;
        } else if (item.dataset.page === "statistics") {
            statisticsPage.hidden = false;
        } else if (item.dataset.page === "settings") {
            settingsPage.hidden = false;
        }
    });
});
function updateStatistics() {
    const items = allTransactionsList.querySelectorAll("li");
    let sum = 0;

    items.forEach(function(item) {
        const text = item.firstChild.textContent;
        const match = text.match(/- ([\d.,]+)đ/);

        if (match) {
            sum += Number(match[1].replace(/[.,]/g, ""));
        }
    });

    const count = items.length;
    const average = count > 0 ? sum / count : 0;

    document.getElementById("statsTotalExpense").textContent =
        sum.toLocaleString("vi-VN") + "đ";

    document.getElementById("statsTransactionCount").textContent = count;

    document.getElementById("statsAverageExpense").textContent =
        Math.round(average).toLocaleString("vi-VN") + "đ";

    const chart = document.getElementById("expenseChart");

    if (count === 0) {
        chart.textContent = "Chưa có dữ liệu thống kê.";
    } else {
        chart.textContent = "Tổng chi tiêu: " + sum.toLocaleString("vi-VN") + "đ";
    }
}
function loadExpenses() {
    isLoadingExpenses = true;

    expenses.forEach(function(expense) {
        expenseNameInput.value = expense.name;
        expenseAmountInput.value = expense.amount;
        addExpense();
    });

    isLoadingExpenses = false;

    expenseNameInput.value = "";
    expenseAmountInput.value = "";

    total = expenses.reduce(function(sum, expense) {
        return sum + expense.amount;
    }, 0);

    totalExpense.textContent = total.toLocaleString("vi-VN") + "đ";
    transactionCount.textContent = allTransactionsList.children.length + " khoản";

    updateStatistics();
}
function updateBalance() {
    totalIncome.textContent =
        totalIncomeAmount.toLocaleString("vi-VN") + "đ";

    balanceDisplay.textContent =
        (totalIncomeAmount - total).toLocaleString("vi-VN") + "đ";
}
addIncomeButton.addEventListener("click", function() {
    const amount = Number(incomeAmountInput.value);

    if (incomeAmountInput.value.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
        return;
    }

    totalIncomeAmount += amount;

    localStorage.setItem("totalIncomeAmount", totalIncomeAmount);

    incomeAmountInput.value = "";

    updateBalance();
});
editIncomeButton.addEventListener("click", function() {
    const amountText = incomeAmountInput.value.trim();

    if (amountText === "") {
        alert("Bro nhập số thu nhập mới trước nhé!");
        return;
    }

    const amount = Number(amountText);

    if (!Number.isFinite(amount) || amount < 0) {
        alert("Số tiền không hợp lệ!");
        return;
    }

    totalIncomeAmount = amount;

    localStorage.setItem("totalIncomeAmount", String(totalIncomeAmount));

    incomeAmountInput.value = "";

    updateBalance();

    alert("Đã cập nhật tổng thu nhập!");
});
updateBalance();
const themeSelect = document.getElementById("themeSelect");
const resetSettings = document.getElementById("resetSettings");

themeSelect.addEventListener("change", function() {
    if (themeSelect.value === "dark") {
    document.body.style.backgroundColor = "#111827";
    document.body.style.color = "#f9fafb";

    document.querySelectorAll(
        ".sidebar, .summary-card, .add-expense-card, .modal-content, .transactions-section, #expenseList li, #allTransactionsList li"
    ).forEach(function(element) {
        element.style.backgroundColor = "#1f2937";
        element.style.color = "#f9fafb";
    });

    document.querySelectorAll(
        "h1, h2, h3, p, label, li"
    ).forEach(function(element) {
        element.style.color = "#f9fafb";
    });

} else {
    document.body.style.backgroundColor = "#f4f7f5";
    document.body.style.color = "#1f2937";

    document.querySelectorAll(
        ".sidebar, .summary-card, .add-expense-card, .modal-content, .transactions-section, #expenseList li, #allTransactionsList li"
    ).forEach(function(element) {
        element.style.backgroundColor = "#ffffff";
        element.style.color = "#1f2937";
    });

    document.querySelectorAll(
        "h1, h2, h3, p, label, li"
    ).forEach(function(element) {
        element.style.color = "";
    });
}
});

resetSettings.addEventListener("click", function() {
    themeSelect.value = "light";
    themeSelect.dispatchEvent(new Event("change"));
});
loadExpenses();