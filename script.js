"use strict";

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 10000],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2025-07-12T10:51:36.790Z",
    "2025-06-07T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
const account3 = {
  owner: "Mouad Bimekliouen",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 100, 2040],
  interestRate: 1.3,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
    "2025-06-08T12:01:20.894Z",
    "2025-06-06T12:01:20.894Z",
  ],
  currency: "MAD",
  locale: "fr-FR",
};
const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed >= 7 || daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const hour = `${date.getHours()}`.padStart(2, 0);
    // const min = `${date.getMinutes()}`.padStart(2, 0);
    const locale = navigator.language;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};
const formateNumber = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);
  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(movementDate);

    const displayDate = formatMovementDate(date);
    const formattedMov = formateNumber(movement, acc.local, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedMov = formateNumber(acc.balance, acc.local, acc.currency);
  labelBalance.textContent = `${formattedMov}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formattedIncomes = formateNumber(incomes, acc.local, acc.currency);
  labelSumIn.textContent = `${formattedIncomes}`;

  const out = Math.abs(
    acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  const formattedOut = formateNumber(out, acc.local, acc.currency);
  labelSumOut.textContent = `${formattedOut}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  const formattedInterest = formateNumber(interest, acc.local, acc.currency);
  labelSumInterest.textContent = `${formattedInterest}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Start Timer Logout
const startLogoutTimer = function () {
  // Set time to 5 minutes
  let time = 300;
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    // in each call print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //whene 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    // decrese 1s
    time--;
  };
  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Event handlers
let currentAccount, timer;
btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "2-digit",
      year: "numeric",
      weekday: "long",
    };
    const local = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);
    //start timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    //Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
      //Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
