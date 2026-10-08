const addExpenseButton = document.getElementById("addExpense");
const expenseNameInput = document.getElementById("expenseName");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseList = document.getElementById("expenseList");
const totalExpense = document.getElementById("totalExpense");
let total = 30000;
addExpenseButton.addEventListener("click", function() {
    const name = expenseNameInput.value;
    const amount = expenseAmountInput.value;
    if (name === "" || amount === "") 
        {
            return;
        }
    const expenseItem = document.createElement("li");
    total += Number(amount);
    totalExpense.textContent = "Tổng chi tiêu: " + total + "đ";
    expenseItem.textContent = name + " - " + amount + "đ";
    expenseList.appendChild(expenseItem);
    expenseNameInput.value = "";
    expenseAmountInput.value = "";
});