"use strict";

/* ---------- Config ---------- */
const STORAGE_KEY = "ledger.transactions";

const CATEGORIES = {
  income: ["Salary", "Freelance", "Business", "Investment", "Other"],
  expense: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Education", "Health", "Rent", "Other"],
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/* ---------- State ---------- */
let transactions = [];
let editingId = null;
let pendingDeleteId = null;
let toastTimer = null;
const filters = { type: "all", category: "all", query: "" };

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const els = {
  balance: $("balanceValue"),
  income: $("incomeValue"),
  expense: $("expenseValue"),
  list: $("transactionList"),
  empty: $("emptyState"),
  emptyTitle: $("emptyTitle"),
  emptyText: $("emptyText"),
  emptyAddBtn: $("emptyAddBtn"),
  count: $("resultCount"),
  openAddBtn: $("openAddBtn"),
  segButtons: document.querySelectorAll(".seg"),
  categoryFilter: $("categoryFilter"),
  search: $("searchInput"),
  formModal: $("formModal"),
  form: $("transactionForm"),
  formTitle: $("formTitle"),
  submitBtn: $("submitBtn"),
  closeFormBtn: $("closeFormBtn"),
  cancelFormBtn: $("cancelFormBtn"),
  amount: $("amount"),
  category: $("category"),
  date: $("date"),
  description: $("description"),
  confirmModal: $("confirmModal"),
  confirmText: $("confirmText"),
  cancelDeleteBtn: $("cancelDeleteBtn"),
  confirmDeleteBtn: $("confirmDeleteBtn"),
  toast: $("toast"),
};

/* ---------- Storage ---------- */
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    showToast("Couldn't save your data. Check your browser storage settings.", "error");
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    transactions = Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    transactions = [];
  }
}

/* ---------- Helpers ---------- */
function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function showToast(message, kind = "success") {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.className = `toast show${kind === "error" ? " error" : ""}`;
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function fillCategorySelect(select, list, includeAll = false) {
  select.innerHTML = "";
  if (includeAll) select.add(new Option("All categories", "all"));
  list.forEach((c) => select.add(new Option(c, c)));
}

/* ---------- Core logic ---------- */
function calculateTotals() {
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );
  totals.balance = totals.income - totals.expense;
  return totals;
}

function filterTransactions(list) {
  return list.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.category !== "all" && t.category !== filters.category) return false;
    return true;
  });
}

function searchTransactions(list) {
  const q = filters.query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (t) =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      String(t.amount).includes(q)
  );
}

function addTransaction(data) {
  transactions.push({ id: Date.now(), ...data });
  saveToLocalStorage();
}

function editTransaction(id, data) {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return false;
  transactions[index] = { ...transactions[index], ...data };
  saveToLocalStorage();
  return true;
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveToLocalStorage();
}

/* ---------- Rendering ---------- */
function renderTotals() {
  const { income, expense, balance } = calculateTotals();
  els.income.textContent = formatCurrency(income);
  els.expense.textContent = formatCurrency(expense);
  els.balance.textContent = formatCurrency(balance);
}

function buildItem(t) {
  const li = document.createElement("li");
  li.className = "item";
  li.dataset.id = t.id;

  const sign = t.type === "income" ? "+" : "−";
  const title = t.description || t.category;

  li.innerHTML = `
    <div class="avatar" aria-hidden="true"></div>
    <div class="item-main">
      <div class="item-title"></div>
      <div class="item-meta"></div>
    </div>
    <div class="item-amount ${t.type}"></div>
    <div class="item-actions">
      <button type="button" class="link-btn edit" data-action="edit">Edit</button>
      <button type="button" class="link-btn delete" data-action="delete">Delete</button>
    </div>`;

  // textContent keeps user input safe from HTML injection
  li.querySelector(".avatar").textContent = t.category.charAt(0);
  li.querySelector(".item-title").textContent = title;
  li.querySelector(".item-meta").textContent =
    `${t.category} · ${formatDate(t.date)} · ${t.type === "income" ? "Income" : "Expense"}`;
  li.querySelector(".item-amount").textContent = `${sign}${formatCurrency(t.amount)}`;
  li.querySelector(".edit").setAttribute("aria-label", `Edit ${title}`);
  li.querySelector(".delete").setAttribute("aria-label", `Delete ${title}`);
  return li;
}

function renderTransactions() {
  renderTotals();

  const visible = searchTransactions(filterTransactions(transactions)).sort(
    (a, b) => b.date.localeCompare(a.date) || b.id - a.id
  );

  els.list.innerHTML = "";
  visible.forEach((t) => els.list.appendChild(buildItem(t)));

  const hasAny = transactions.length > 0;
  els.empty.hidden = visible.length > 0;
  els.list.hidden = visible.length === 0;
  els.count.textContent = hasAny ? `${visible.length} of ${transactions.length}` : "";

  if (!hasAny) {
    els.emptyTitle.textContent = "No transactions yet";
    els.emptyText.textContent = "Add your first transaction to start tracking your finances.";
    els.emptyAddBtn.hidden = false;
  } else if (visible.length === 0) {
    els.emptyTitle.textContent = "No matching transactions";
    els.emptyText.textContent = "Try a different filter or search term.";
    els.emptyAddBtn.hidden = true;
  }
}

function renderCategoryFilter() {
  const pool = filters.type === "all"
    ? [...new Set([...CATEGORIES.income, ...CATEGORIES.expense])]
    : CATEGORIES[filters.type];
  fillCategorySelect(els.categoryFilter, pool, true);
  if (!pool.includes(filters.category)) filters.category = "all";
  els.categoryFilter.value = filters.category;
}

/* ---------- Form ---------- */
function selectedType() {
  return els.form.elements.type.value;
}

function clearErrors() {
  els.form.querySelectorAll("[data-error]").forEach((p) => (p.textContent = ""));
  els.form.querySelectorAll(".is-invalid").forEach((i) => i.classList.remove("is-invalid"));
}

function setError(field, message) {
  els.form.querySelector(`[data-error="${field}"]`).textContent = message;
  els.form.elements[field].classList.add("is-invalid");
}

function validateForm() {
  clearErrors();
  let valid = true;
  const amount = parseFloat(els.amount.value);

  if (!els.amount.value || !Number.isFinite(amount) || amount <= 0) {
    setError("amount", "Enter an amount greater than 0.");
    valid = false;
  } else if (amount > 1e9) {
    setError("amount", "That amount is too large.");
    valid = false;
  }
  if (!els.category.value) {
    setError("category", "Choose a category.");
    valid = false;
  }
  if (!els.date.value) {
    setError("date", "Pick a date.");
    valid = false;
  }
  if (els.description.value.trim().length === 0) {
    setError("description", "Add a short description.");
    valid = false;
  }
  return valid;
}

function openForm(transaction = null) {
  editingId = transaction ? transaction.id : null;
  clearErrors();
  els.form.reset();

  const type = transaction ? transaction.type : "expense";
  els.form.elements.type.value = type;
  fillCategorySelect(els.category, CATEGORIES[type]);

  if (transaction) {
    els.amount.value = transaction.amount;
    els.category.value = transaction.category;
    els.date.value = transaction.date;
    els.description.value = transaction.description;
  } else {
    els.date.value = todayISO();
  }

  els.formTitle.textContent = transaction ? "Edit transaction" : "Add transaction";
  els.submitBtn.textContent = transaction ? "Save changes" : "Add transaction";
  els.formModal.showModal();
  els.amount.focus();
}

function closeForm() {
  els.formModal.close();
  editingId = null;
}

function handleSubmit(event) {
  event.preventDefault();
  if (!validateForm()) {
    showToast("Please fix the highlighted fields.", "error");
    return;
  }

  const data = {
    type: selectedType(),
    amount: Math.round(parseFloat(els.amount.value) * 100) / 100,
    category: els.category.value,
    date: els.date.value,
    description: els.description.value.trim(),
  };

  if (editingId !== null) {
    editTransaction(editingId, data);
    showToast("Transaction updated.");
  } else {
    addTransaction(data);
    showToast("Transaction added.");
  }

  els.form.reset();
  closeForm();
  renderTransactions();
}

/* ---------- Delete ---------- */
function requestDelete(id) {
  const t = transactions.find((x) => x.id === id);
  if (!t) return;
  pendingDeleteId = id;
  els.confirmText.textContent = `${t.description} · ${formatCurrency(t.amount)} will be removed. This can't be undone.`;
  els.confirmModal.showModal();
}

function confirmDelete() {
  if (pendingDeleteId !== null) {
    deleteTransaction(pendingDeleteId);
    pendingDeleteId = null;
    showToast("Transaction deleted.");
    renderTransactions();
  }
  els.confirmModal.close();
}

/* ---------- Events ---------- */
function closeOnBackdrop(dialog) {
  dialog.addEventListener("mousedown", (e) => {
    const r = dialog.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside) dialog.close();
  });
}

function bindEvents() {
  els.openAddBtn.addEventListener("click", () => openForm());
  els.emptyAddBtn.addEventListener("click", () => openForm());
  els.closeFormBtn.addEventListener("click", closeForm);
  els.cancelFormBtn.addEventListener("click", closeForm);
  els.form.addEventListener("submit", handleSubmit);

  // Swap category options when the type changes
  els.form.querySelectorAll('input[name="type"]').forEach((radio) =>
    radio.addEventListener("change", () => fillCategorySelect(els.category, CATEGORIES[selectedType()]))
  );

  // Edit / delete via event delegation
  els.list.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.closest(".item").dataset.id);
    if (btn.dataset.action === "edit") {
      openForm(transactions.find((t) => t.id === id));
    } else {
      requestDelete(id);
    }
  });

  els.cancelDeleteBtn.addEventListener("click", () => els.confirmModal.close());
  els.confirmDeleteBtn.addEventListener("click", confirmDelete);
  els.confirmModal.addEventListener("close", () => (pendingDeleteId = null));
  closeOnBackdrop(els.formModal);
  closeOnBackdrop(els.confirmModal);

  // Filters
  els.segButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.type = btn.dataset.type;
      els.segButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      renderCategoryFilter();
      renderTransactions();
    })
  );
  els.categoryFilter.addEventListener("change", () => {
    filters.category = els.categoryFilter.value;
    renderTransactions();
  });
  els.search.addEventListener("input", () => {
    filters.query = els.search.value;
    renderTransactions();
  });
}

/* ---------- Init ---------- */
function init() {
  loadFromLocalStorage();
  renderCategoryFilter();
  bindEvents();
  renderTransactions();
}

init();
