document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTS
  const body = document.body;
  const dashboardPage = document.querySelector("#dashboardPage");
  const transactionsPage = document.querySelector("#transactionsPage");
  const analyticsPage = document.querySelector("#analyticsPage");
  const aiPage = document.querySelector("#aiPage");
  const settingsPage = document.querySelector("#settingsPage");
  const navLinks = document.querySelectorAll(".nav-link");

  const balanceElement = document.querySelector("#balance");
  const incomeElement = document.querySelector("#income");
  const expensesElement = document.querySelector("#expenses");

  const dashboardTransactions = document.querySelector("#dashboardTransactions");
  const dashboardEmptyState = document.querySelector("#dashboardEmptyState");
  const searchInput = document.querySelector("#searchInput");
  const filterType = document.querySelector("#filterType");

  const transactionsPageList = document.querySelector("#transactionsPageList");
  const transactionsEmptyState = document.querySelector("#transactionsEmptyState");
  const transactionsSearch = document.querySelector("#transactionsSearch");
  const transactionsFilter = document.querySelector("#transactionsFilter");
  const totalTransactions = document.querySelector("#totalTransactions");
  const totalIncome = document.querySelector("#totalIncome");
  const totalExpenses = document.querySelector("#totalExpenses");

  const quickAddBtn = document.querySelector("#quickAddBtn");
  const dashboardAddBtn = document.querySelector("#dashboardAddBtn");
  const transactionsAddBtn = document.querySelector("#transactionsAddBtn");
  const transactionModal = document.querySelector("#transactionModal");
  const closeModal = document.querySelector("#closeModal");
  const transactionForm = document.querySelector("#transactionForm");
  const transactionTitle = document.querySelector("#transactionTitle");
  const transactionAmount = document.querySelector("#transactionAmount");
  const transactionType = document.querySelector("#transactionType");
  const transactionCategory = document.querySelector("#transactionCategory");
  const transactionDate = document.querySelector("#transactionDate");

  const deleteModal = document.querySelector("#deleteModal");
  const closeDeleteModal = document.querySelector("#closeDeleteModal");
  const cancelDelete = document.querySelector("#cancelDelete");
  const confirmDelete = document.querySelector("#confirmDelete");

  const chartPeriod = document.querySelector("#chartPeriod");
  const chartBars = document.querySelector("#chartBars");
  const chartDays = document.querySelector("#chartDays");
  const chartTooltip = document.querySelector("#chartTooltip");

  const themeBtn = document.querySelector(".theme-btn");

  const analyticsIncome = document.querySelector("#analyticsIncome");
  const analyticsExpenses = document.querySelector("#analyticsExpenses");
  const analyticsSavings = document.querySelector("#analyticsSavings");
  const analyticsTransactions = document.querySelector("#analyticsTransactions");
  const categoryBreakdown = document.querySelector("#categoryBreakdown");
  const healthScore = document.querySelector("#healthScore");

  const aiSpendingInsight = document.querySelector("#aiSpendingInsight");
  const aiSavingsInsight = document.querySelector("#aiSavingsInsight");
  const aiSmartTip = document.querySelector("#aiSmartTip");
  const aiChatMessages = document.querySelector("#aiChatMessages");
  const aiInput = document.querySelector("#aiInput");
  const aiSendBtn = document.querySelector("#aiSendBtn");
  const aiQuestions = document.querySelectorAll(".ai-question");

  const settingsName = document.querySelector("#settingsName");
  const settingsEmail = document.querySelector("#settingsEmail");
  const darkModeToggle = document.querySelector("#darkModeToggle");
  const notificationToggle = document.querySelector("#notificationToggle");
  const weeklySummaryToggle = document.querySelector("#weeklySummaryToggle");
  const currencySelect = document.querySelector("#currencySelect");
  const saveSettingsBtn = document.querySelector("#saveSettingsBtn");
  const settingsSavedMessage = document.querySelector("#settingsSavedMessage");
  const exportDataBtn = document.querySelector("#exportDataBtn");
  const clearDataBtn = document.querySelector("#clearDataBtn");

  // STORAGE
  let transactions = JSON.parse(localStorage.getItem("finoraTransactions")) || [];
  let settings = JSON.parse(localStorage.getItem("finoraSettings")) || {
    name: "",
    email: "",
    currency: "USD",
    darkMode: true,
    notifications: true,
    weeklySummary: true
  };
  let transactionToDelete = null;
  let currentChartPeriod = "7";

  // HELPERS
  function saveTransactions() {
    localStorage.setItem("finoraTransactions", JSON.stringify(transactions));
  }

  function saveSettings() {
    localStorage.setItem("finoraSettings", JSON.stringify(settings));
  }

  function currencySymbol() {
    const symbols = { USD: "$", EUR: "€", GBP: "£", CAD: "C$" };
    return symbols[settings.currency] || "$";
  }

  function formatMoney(value) {
    return currencySymbol() + Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  function formatDate(dateString) {
    if (!dateString) return "No date";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "No date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function setDefaultDate() {
    if (transactionDate) transactionDate.value = getTodayString();
  }

  // PAGE NAVIGATION
  function showPage(pageName) {
    const pages = {
      dashboard: dashboardPage,
      transactions: transactionsPage,
      analytics: analyticsPage,
      ai: aiPage,
      settings: settingsPage
    };

    Object.values(pages).forEach(page => {
      if (page) page.style.display = "none";
    });

    navLinks.forEach(link => link.classList.remove("active"));

    if (pages[pageName]) {
      pages[pageName].style.display = "block";
    }

    const activeLink = document.querySelector(
      `.nav-link[data-page="${pageName}"]`
    );

    if (activeLink) {
      activeLink.classList.add("active");
    }

    if (pageName === "analytics") updateAnalytics();
    if (pageName === "ai") updateAIInsights();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      const page = link.dataset.page;

      showPage(page);
    });
  });

  // DASHBOARD TOTALS
  function calculateTotals() {
    let income = 0;
    let expenses = 0;

    transactions.forEach(transaction => {
      const amount = Number(transaction.amount) || 0;

      if (transaction.type === "income") {
        income += amount;
      } else {
        expenses += amount;
      }
    });

    return {
      income,
      expenses,
      transactionCount: transactions.length
    };
  }

  function updateDashboardTotals() {
    const totals = calculateTotals();

    const startingBalance = 12450;
    const startingIncome = 5200;
    const startingExpenses = 1850;

    const income = startingIncome + totals.income;
    const expenses = startingExpenses + totals.expenses;
    const balance = startingBalance + totals.income - totals.expenses;

    if (balanceElement) {
      balanceElement.textContent = formatMoney(balance);
    }

    if (incomeElement) {
      incomeElement.textContent = formatMoney(income);
    }

    if (expensesElement) {
      expensesElement.textContent = formatMoney(expenses);
    }
  }

  // TRANSACTION ICON
  function getCategoryIcon(category) {
    const icons = {
      shopping: "🛍",
      food: "🍔",
      entertainment: "🎬",
      transport: "🚗",
      salary: "💼",
      freelance: "💻",
      other: "◈"
    };

    return icons[category] || "◈";
  }

  // CREATE TRANSACTION
  function createTransactionElement(transaction) {
    const item = document.createElement("div");

    item.className = "transaction";

    const isIncome = transaction.type === "income";
    const amountPrefix = isIncome ? "+" : "-";
    const category = transaction.category || "other";

    item.innerHTML = `
      <div class="transaction-info">
        <div class="transaction-icon">${getCategoryIcon(category)}</div>

        <div>
          <span class="transaction-title">
            ${escapeHTML(transaction.title)}
          </span>

          <span class="transaction-meta">
            ${capitalize(category)} · ${formatDate(transaction.date)}
          </span>
        </div>
      </div>

      <div class="transaction-right">
        <span class="transaction-amount ${isIncome ? "income" : "expense"}">
          ${amountPrefix}${formatMoney(transaction.amount)}
        </span>

        <button
          class="delete-btn"
          type="button"
          data-id="${transaction.id}"
          aria-label="Delete transaction"
        >
          ×
        </button>
      </div>
    `;

    const deleteButton = item.querySelector(".delete-btn");

    deleteButton.addEventListener("click", () => {
      openDeleteModal(transaction.id);
    });

    return item;
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function capitalize(value) {
    if (!value) return "";

    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  // RENDER DASHBOARD TRANSACTIONS
  function renderDashboardTransactions() {
    if (!dashboardTransactions) return;

    dashboardTransactions.innerHTML = "";

    const search = (searchInput?.value || "")
      .trim()
      .toLowerCase();

    const filter = filterType?.value || "all";

    let filtered = transactions.filter(transaction => {
      const matchesSearch =
        transaction.title.toLowerCase().includes(search);

      const matchesFilter =
        filter === "all" ||
        transaction.type === filter;

      return matchesSearch && matchesFilter;
    });

    filtered = filtered.slice(0, 6);

    if (filtered.length === 0) {
      if (dashboardEmptyState) {
        dashboardEmptyState.style.display = "flex";
      }

      return;
    }

    if (dashboardEmptyState) {
      dashboardEmptyState.style.display = "none";
    }

    filtered.forEach(transaction => {
      dashboardTransactions.appendChild(
        createTransactionElement(transaction)
      );
    });
  }

  // RENDER TRANSACTIONS PAGE
  function renderTransactionsPage() {
    if (!transactionsPageList) return;

    transactionsPageList.innerHTML = "";

    const search = (transactionsSearch?.value || "")
      .trim()
      .toLowerCase();

    const filter = transactionsFilter?.value || "all";

    const filtered = transactions.filter(transaction => {
      const matchesSearch =
        transaction.title.toLowerCase().includes(search);

      const matchesFilter =
        filter === "all" ||
        transaction.type === filter;

      return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
      if (transactionsEmptyState) {
        transactionsEmptyState.style.display = "flex";
      }

      return;
    }

    if (transactionsEmptyState) {
      transactionsEmptyState.style.display = "none";
    }

    filtered.forEach(transaction => {
      transactionsPageList.appendChild(
        createTransactionElement(transaction)
      );
    });
  }

  // TRANSACTION SUMMARY
  function updateTransactionSummary() {
    const totals = calculateTotals();

    if (totalTransactions) {
      totalTransactions.textContent = totals.transactionCount;
    }

    if (totalIncome) {
      totalIncome.textContent = formatMoney(totals.income);
    }

    if (totalExpenses) {
      totalExpenses.textContent = formatMoney(totals.expenses);
    }
  }

  // ADD TRANSACTION MODAL
  function openTransactionModal() {
    if (!transactionModal) return;

    transactionModal.classList.add("show");

    setDefaultDate();

    setTimeout(() => {
      transactionTitle?.focus();
    }, 100);
  }

  function closeTransactionModal() {
    if (!transactionModal) return;

    transactionModal.classList.remove("show");
  }

  quickAddBtn?.addEventListener("click", openTransactionModal);
  dashboardAddBtn?.addEventListener("click", openTransactionModal);
  transactionsAddBtn?.addEventListener("click", openTransactionModal);

  closeModal?.addEventListener("click", closeTransactionModal);

  transactionModal?.addEventListener("click", event => {
    if (event.target === transactionModal) {
      closeTransactionModal();
    }
  });

  // ADD TRANSACTION
  transactionForm?.addEventListener("submit", event => {
    event.preventDefault();

    const title = transactionTitle.value.trim();
    const amount = Number(transactionAmount.value);
    const type = transactionType.value;
    const category = transactionCategory.value;
    const date = transactionDate.value;

    if (!title || !amount || amount <= 0 || !date) return;

    const newTransaction = {
      id: Date.now(),
      title,
      amount,
      type,
      category,
      date: new Date(`${date}T12:00:00`).toISOString()
    };

    transactions.unshift(newTransaction);

    saveTransactions();

    transactionForm.reset();

    setDefaultDate();

    closeTransactionModal();

    refreshAll();
  });

  // DELETE MODAL
  function openDeleteModal(id) {
    transactionToDelete = id;

    deleteModal?.classList.add("show");
  }

  function closeDeleteConfirmation() {
    transactionToDelete = null;

    deleteModal?.classList.remove("show");
  }

  closeDeleteModal?.addEventListener(
    "click",
    closeDeleteConfirmation
  );

  cancelDelete?.addEventListener(
    "click",
    closeDeleteConfirmation
  );

  deleteModal?.addEventListener("click", event => {
    if (event.target === deleteModal) {
      closeDeleteConfirmation();
    }
  });

  confirmDelete?.addEventListener("click", () => {
    if (!transactionToDelete) return;

    transactions = transactions.filter(
      transaction =>
        transaction.id !== transactionToDelete
    );

    saveTransactions();

    closeDeleteConfirmation();

    refreshAll();
  });

  // SEARCH
  searchInput?.addEventListener(
    "input",
    renderDashboardTransactions
  );

  filterType?.addEventListener(
    "change",
    renderDashboardTransactions
  );

  transactionsSearch?.addEventListener(
    "input",
    renderTransactionsPage
  );

  transactionsFilter?.addEventListener(
    "change",
    renderTransactionsPage
  );

  // CHART DATA
  function getDefaultChartData() {
    return [
      { income: 40, expense: 22 },
      { income: 65, expense: 34 },
      { income: 50, expense: 42 },
      { income: 78, expense: 38 },
      { income: 61, expense: 47 },
      { income: 86, expense: 51 },
      { income: 72, expense: 45 }
    ];
  }

  function getChartLabels() {
    if (currentChartPeriod === "7") {
      const labels = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();

        date.setDate(
          date.getDate() - i
        );

        labels.push(
          date.toLocaleDateString(
            "en-US",
            {
              weekday: "short"
            }
          )
        );
      }

      return labels;
    }

    if (currentChartPeriod === "30") {
      return [
        "26-30",
        "21-25",
        "16-20",
        "11-15",
        "6-10",
        "1-5",
        "Today"
      ];
    }

    const labels = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      labels.push(
        date.toLocaleDateString(
          "en-US",
          {
            month: "short"
          }
        )
      );
    }

    return labels;
  }

  function getChartData() {
    const labels = getChartLabels();

    const data = labels.map(() => ({
      income: 0,
      expense: 0
    }));

    if (transactions.length === 0) {
      return getDefaultChartData();
    }

    const now = new Date();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const amount =
        Number(transaction.amount) || 0;

      let index = -1;

      // LAST 7 DAYS
      if (currentChartPeriod === "7") {
        const diff = Math.floor(
          (
            now.getTime() -
            date.getTime()
          ) / 86400000
        );

        if (diff >= 0 && diff <= 6) {
          index = 6 - diff;
        }
      }

      // LAST 30 DAYS
      if (currentChartPeriod === "30") {
        const diff = Math.floor(
          (
            now.getTime() -
            date.getTime()
          ) / 86400000
        );

        if (diff >= 0 && diff <= 29) {
          if (diff >= 25) {
            index = 0;
          } else if (diff >= 20) {
            index = 1;
          } else if (diff >= 15) {
            index = 2;
          } else if (diff >= 10) {
            index = 3;
          } else if (diff >= 5) {
            index = 4;
          } else if (diff >= 1) {
            index = 5;
          } else {
            index = 6;
          }
        }
      }

      // LAST 3 MONTHS
      if (currentChartPeriod === "3") {
        const monthDiff =
          (
            now.getFullYear() -
            date.getFullYear()
          ) * 12 +
          (
            now.getMonth() -
            date.getMonth()
          );

        if (
          monthDiff >= 0 &&
          monthDiff <= 6
        ) {
          index = 6 - monthDiff;
        }
      }

      if (
        index >= 0 &&
        index < data.length
      ) {
        if (transaction.type === "income") {
          data[index].income += amount;
        } else if (transaction.type === "expense") {
          data[index].expense += amount;
        }
      }
    });

    const hasActivity = data.some(
      item =>
        item.income > 0 ||
        item.expense > 0
    );

    if (!hasActivity) {
      return data;
    }

    return data;
  }

  // UPDATE CHART
  function updateChart() {
    if (!chartBars) return;

    const wrappers =
      chartBars.querySelectorAll(
        ".bar-wrapper"
      );

    const data = getChartData();
    const labels = getChartLabels();

    const maxValue = Math.max(
      ...data.map(item =>
        Math.max(
          item.income,
          item.expense
        )
      ),
      1
    );

    wrappers.forEach(
      (wrapper, index) => {
        const bar =
          wrapper.querySelector(".bar");

        if (!bar) return;

        const item =
          data[index] || {
            income: 0,
            expense: 0
          };

        const value =
          Math.max(
            item.income,
            item.expense
          );

        const height =
          Math.max(
            7,
            (value / maxValue) * 90
          );

        bar.style.height =
          `${height}%`;

        if (
          item.expense >
          item.income
        ) {
          bar.classList.add(
            "expense"
          );
        } else {
          bar.classList.remove(
            "expense"
          );
        }

        wrapper.dataset.index =
          index;

        wrapper.dataset.label =
          labels[index] || "";

        wrapper.dataset.income =
          item.income;

        wrapper.dataset.expense =
          item.expense;
      }
    );

    if (chartDays) {
      chartDays.innerHTML = "";

      labels.forEach(label => {
        const span =
          document.createElement(
            "span"
          );

        span.textContent = label;

        chartDays.appendChild(span);
      });
    }

    setupChartTooltips();
  }

  // CHART TOOLTIP
  function setupChartTooltips() {
    const wrappers =
      chartBars?.querySelectorAll(
        ".bar-wrapper"
      );

    if (!wrappers) return;

    wrappers.forEach(wrapper => {
      if (
        wrapper.dataset.tooltipReady ===
        "true"
      ) {
        return;
      }

      wrapper.dataset.tooltipReady =
        "true";

      const showTooltip = event => {
        const label =
          wrapper.dataset.label ||
          "Activity";

        const income =
          Number(
            wrapper.dataset.income
          ) || 0;

        const expense =
          Number(
            wrapper.dataset.expense
          ) || 0;

        chartTooltip.innerHTML = `
          <strong>${label}</strong>

          <div style="margin-top:6px;">
            Income: ${formatMoney(income)}
          </div>

          <div style="margin-top:3px;">
            Expenses: ${formatMoney(expense)}
          </div>
        `;

        let x;
        let y;

        if (
          event &&
          event.clientX
        ) {
          x = event.clientX;
          y = event.clientY;
        } else {
          const rect =
            wrapper.getBoundingClientRect();

          x =
            rect.left +
            rect.width / 2;

          y = rect.top;
        }

        chartTooltip.style.left =
          `${x}px`;

        chartTooltip.style.top =
          `${y}px`;

        chartTooltip.classList.add(
          "show"
        );
      };

      const hideTooltip = () => {
        chartTooltip.classList.remove(
          "show"
        );
      };

      wrapper.addEventListener(
        "mouseenter",
        showTooltip
      );

      wrapper.addEventListener(
        "mousemove",
        showTooltip
      );

      wrapper.addEventListener(
        "mouseleave",
        hideTooltip
      );

      wrapper.addEventListener(
        "touchstart",
        event => {
          event.preventDefault();

          showTooltip(
            event.touches[0]
          );
        },
        {
          passive: false
        }
      );
    });
  }

  chartPeriod?.addEventListener(
    "change",
    () => {
      currentChartPeriod =
        chartPeriod.value;

      updateChart();
    }
  );

  // ANALYTICS
  function updateAnalytics() {
    const totals =
      calculateTotals();

    if (analyticsIncome) {
      analyticsIncome.textContent =
        formatMoney(totals.income);
    }

    if (analyticsExpenses) {
      analyticsExpenses.textContent =
        formatMoney(totals.expenses);
    }

    if (analyticsTransactions) {
      analyticsTransactions.textContent =
        totals.transactionCount;
    }

    const savings =
      totals.income > 0
        ? Math.max(
            0,
            (
              (
                totals.income -
                totals.expenses
              ) /
              totals.income
            ) * 100
          )
        : 0;

    if (analyticsSavings) {
      analyticsSavings.textContent =
        `${Math.round(savings)}%`;
    }

    updateCategoryBreakdown();
    updateHealthScore();
  }

  // CATEGORY BREAKDOWN
  function updateCategoryBreakdown() {
    if (!categoryBreakdown) return;

    const categoryTotals = {};

    transactions.forEach(transaction => {
      if (
        transaction.type !==
        "expense"
      ) {
        return;
      }

      const category =
        transaction.category ||
        "other";

      categoryTotals[category] =
        (
          categoryTotals[category] ||
          0
        ) +
        Number(
          transaction.amount || 0
        );
    });

    const entries =
      Object.entries(
        categoryTotals
      ).sort(
        (a, b) =>
          b[1] - a[1]
      );

    if (entries.length === 0) {
      categoryBreakdown.innerHTML = `
        <div class="analytics-empty">
          Add transactions to see your spending breakdown.
        </div>
      `;

      return;
    }

    const max =
      entries[0][1];

    categoryBreakdown.innerHTML =
      "";

    entries.forEach(
      ([category, amount]) => {
        const percentage =
          (amount / max) * 100;

        const row =
          document.createElement(
            "div"
          );

        row.className =
          "category-row";

        row.innerHTML = `
          <div class="category-row-top">
            <span>${capitalize(category)}</span>
            <strong>${formatMoney(amount)}</strong>
          </div>

          <div class="category-bar">
            <div
              class="category-bar-fill"
              style="width:${percentage}%"
            ></div>
          </div>
        `;

        categoryBreakdown.appendChild(
          row
        );
      }
    );
  }

  // FINANCIAL HEALTH SCORE
  function updateHealthScore() {
    if (!healthScore) return;

    const totals =
      calculateTotals();

    if (totals.income === 0) {
      healthScore.textContent =
        "82";

      return;
    }

    const savingsRate =
      (
        (
          totals.income -
          totals.expenses
        ) /
        totals.income
      ) * 100;

    let score;

    if (savingsRate >= 50) {
      score = 95;
    } else if (savingsRate >= 35) {
      score = 88;
    } else if (savingsRate >= 20) {
      score = 78;
    } else if (savingsRate >= 10) {
      score = 65;
    } else {
      score = 50;
    }

    healthScore.textContent =
      score;
  }

  // AI INSIGHTS
  function updateAIInsights() {
    const totals =
      calculateTotals();

    if (transactions.length === 0) {
      aiSpendingInsight.textContent =
        "Add transactions to generate your spending insight.";

      aiSavingsInsight.textContent =
        "Your savings analysis will appear here.";

      aiSmartTip.textContent =
        "Start tracking your expenses to receive personalized financial tips.";

      return;
    }

    const expenseTransactions =
      transactions.filter(
        t => t.type === "expense"
      );

    const incomeTransactions =
      transactions.filter(
        t => t.type === "income"
      );

    let biggestExpense = null;

    expenseTransactions.forEach(
      transaction => {
        if (
          !biggestExpense ||
          Number(transaction.amount) >
            Number(biggestExpense.amount)
        ) {
          biggestExpense =
            transaction;
        }
      }
    );

    const savings =
      totals.income -
      totals.expenses;

    const savingsRate =
      totals.income > 0
        ? (
            savings /
            totals.income
          ) * 100
        : 0;

    if (biggestExpense) {
      aiSpendingInsight.textContent =
        `Your biggest tracked expense is ${biggestExpense.title} at ${formatMoney(biggestExpense.amount)}.`;
    }

    if (
      incomeTransactions.length >
      0
    ) {
      aiSavingsInsight.textContent =
        `You have ${formatMoney(savings)} remaining from your tracked income, with a ${Math.round(savingsRate)}% savings rate.`;
    } else {
      aiSavingsInsight.textContent =
        "Add an income transaction to calculate your savings rate.";
    }

    if (savingsRate >= 40) {
      aiSmartTip.textContent =
        "Your tracked savings rate is strong. Keep monitoring your expenses to maintain this level.";
    } else if (
      savingsRate >= 20
    ) {
      aiSmartTip.textContent =
        "Your finances show room for saving. Review your largest expense categories first.";
    } else {
      aiSmartTip.textContent =
        "Try reviewing recurring expenses and identifying one category where you can reduce spending.";
    }
  }

  // AI CHAT
  function addAIMessage(
    text,
    type = "ai"
  ) {
    const message =
      document.createElement(
        "div"
      );

    message.className =
      "ai-message";

    if (type === "user") {
      message.innerHTML = `
        <div
          class="ai-message-avatar"
          style="background:var(--primary-soft);color:var(--primary);"
        >
          You
        </div>

        <div>
          <strong>You</strong>
          <p>${escapeHTML(text)}</p>
        </div>
      `;
    } else {
      message.innerHTML = `
        <div class="ai-message-avatar">
          ✦
        </div>

        <div>
          <strong>Finora AI</strong>
          <p>${escapeHTML(text)}</p>
        </div>
      `;
    }

    aiChatMessages.appendChild(
      message
    );

    aiChatMessages.scrollTop =
      aiChatMessages.scrollHeight;
  }

  function getAIResponse(question) {
    const q =
      question.toLowerCase();

    const totals =
      calculateTotals();

    const expenses =
      transactions.filter(
        t => t.type === "expense"
      );

    const incomes =
      transactions.filter(
        t => t.type === "income"
      );

    if (
      q.includes("spent") ||
      q.includes("expense") ||
      q.includes("spend")
    ) {
      return `Your tracked expenses total ${formatMoney(totals.expenses)}.`;
    }

    if (
      q.includes("save") ||
      q.includes("saving")
    ) {
      const saved =
        totals.income -
        totals.expenses;

      return `Based on your tracked transactions, you have ${formatMoney(saved)} remaining.`;
    }

    if (
      q.includes("biggest")
    ) {
      if (expenses.length === 0) {
        return "You don't have any tracked expenses yet.";
      }

      const biggest =
        expenses.reduce(
          (max, current) =>
            Number(current.amount) >
            Number(max.amount)
              ? current
              : max
        );

      return `Your biggest tracked expense is ${biggest.title} at ${formatMoney(biggest.amount)}.`;
    }

    if (
      q.includes("income") ||
      q.includes("earn")
    ) {
      return `Your tracked income totals ${formatMoney(totals.income)}.`;
    }

    if (
      q.includes("transaction")
    ) {
      return `You currently have ${transactions.length} tracked transaction${transactions.length === 1 ? "" : "s"}.`;
    }

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {
      return "Hi! I'm Finora AI. Ask me about your spending, income, savings, or biggest expense.";
    }

    return "I can help with your tracked spending, income, savings, transactions, and biggest expenses.";
  }

  function sendAIQuestion(question) {
    const cleanQuestion =
      question.trim();

    if (!cleanQuestion) return;

    addAIMessage(
      cleanQuestion,
      "user"
    );

    setTimeout(() => {
      addAIMessage(
        getAIResponse(
          cleanQuestion
        ),
        "ai"
      );
    }, 350);
  }

  aiSendBtn?.addEventListener(
    "click",
    () => {
      sendAIQuestion(
        aiInput.value
      );

      aiInput.value = "";
    }
  );

  aiInput?.addEventListener(
    "keydown",
    event => {
      if (event.key === "Enter") {
        sendAIQuestion(
          aiInput.value
        );

        aiInput.value = "";
      }
    }
  );

  aiQuestions.forEach(
    button =>
      button.addEventListener(
        "click",
        () =>
          sendAIQuestion(
            button.dataset.question
          )
      )
  );

  // SETTINGS
  function loadSettings() {
    if (settingsName) {
      settingsName.value =
        settings.name || "";
    }

    if (settingsEmail) {
      settingsEmail.value =
        settings.email || "";
    }

    if (currencySelect) {
      currencySelect.value =
        settings.currency ||
        "USD";
    }

    if (darkModeToggle) {
      darkModeToggle.checked =
        settings.darkMode;
    }

    if (notificationToggle) {
      notificationToggle.checked =
        settings.notifications;
    }

    if (weeklySummaryToggle) {
      weeklySummaryToggle.checked =
        settings.weeklySummary;
    }

    applyTheme();
  }

  function applyTheme() {
    body.classList.toggle(
      "light-mode",
      !settings.darkMode
    );

    if (darkModeToggle) {
      darkModeToggle.checked =
        settings.darkMode;
    }

    if (themeBtn) {
      themeBtn.textContent =
        settings.darkMode
          ? "🌙"
          : "☀️";
    }
  }

  themeBtn?.addEventListener(
    "click",
    () => {
      settings.darkMode =
        !settings.darkMode;

      saveSettings();

      applyTheme();
    }
  );

  darkModeToggle?.addEventListener(
    "change",
    () => {
      settings.darkMode =
        darkModeToggle.checked;

      saveSettings();

      applyTheme();
    }
  );

  saveSettingsBtn?.addEventListener(
    "click",
    () => {
      settings.name =
        settingsName?.value.trim() ||
        "";

      settings.email =
        settingsEmail?.value.trim() ||
        "";

      settings.currency =
        currencySelect?.value ||
        "USD";

      settings.darkMode =
        darkModeToggle?.checked ??
        true;

      settings.notifications =
        notificationToggle?.checked ??
        true;

      settings.weeklySummary =
        weeklySummaryToggle?.checked ??
        true;

      saveSettings();

      applyTheme();

      refreshAll();

      if (settingsSavedMessage) {
        settingsSavedMessage.classList.add(
          "show"
        );

        setTimeout(
          () =>
            settingsSavedMessage.classList.remove(
              "show"
            ),
          2200
        );
      }
    }
  );

  // EXPORT DATA
  exportDataBtn?.addEventListener(
    "click",
    () => {
      const data = {
        exportedAt:
          new Date().toISOString(),
        settings,
        transactions
      };

      const blob = new Blob(
        [
          JSON.stringify(
            data,
            null,
            2
          )
        ],
        {
          type: "application/json"
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement(
          "a"
        );

      link.href = url;
      link.download =
        "finora-data.json";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    }
  );

  // CLEAR DATA
  clearDataBtn?.addEventListener(
    "click",
    () => {
      if (transactions.length === 0) {
        alert(
          "There are no transactions to clear."
        );

        return;
      }

      const confirmed =
        confirm(
          "Are you sure you want to delete all transactions?"
        );

      if (!confirmed) return;

      transactions = [];

      saveTransactions();

      refreshAll();
    }
  );

  // REFRESH EVERYTHING
  function refreshAll() {
    updateDashboardTotals();
    renderDashboardTransactions();
    renderTransactionsPage();
    updateTransactionSummary();
    updateAnalytics();
    updateAIInsights();
    updateChart();
  }

  // INITIALIZE
  loadSettings();

  setDefaultDate();

  showPage("dashboard");

  refreshAll();
});