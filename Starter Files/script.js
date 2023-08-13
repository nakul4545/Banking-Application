'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// MY BANK APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Nakul Patil',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2023-07-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Ashok Patil',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'pt-PT',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const FormatCurrency = function(value,locale,currency){
  return new Intl.NumberFormat(locale,{
    style:"currency",
    currency:currency
  }).format(value)
}
const FormatMovementDate = function(date ,locale){
  const calcDaysPassed = (date1 ,date2) =>
  Math.round(Math.abs(date2 - date1)/(1000*60*60*24));
  const daysPassed = calcDaysPassed(new Date () ,date);
  if(daysPassed === 0) return "Today";
  if(daysPassed === 1) return "Yesterday";
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  else{
    // const day = `${date.getDate()}`.padStart(2, 0); //first srgument how many char u want and second if not 2 digit then add 0
    // const month = `${date.getMonth() + 1}`.padStart(2, 0); //+1 for javascript starts from 0
    // const year = date.getFullYear();

    // return `${day}/ ${month}/ ${year}`;          //Use navigator.language to know the locale in console
    return new Intl.DateTimeFormat(locale).format(date)
  }
}
const displayMovements = function (acc,) {
  containerMovements.innerHTML = '';

  const movs = acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);

    const dateLabel = FormatMovementDate(date,acc.locale);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1
      } ${type}</div>
      <div class="movements__date">${dateLabel}</div>
        <div class="movements__value">${new Intl.NumberFormat(acc.locale,{
          style:"currency",
          currency:acc.currency   //In us , and in EUR . is there
        }).format(mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = FormatCurrency(acc.balance,acc.locale,acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = FormatCurrency(incomes.toFixed(2),acc.locale,acc.currency)//`${incomes.toFixed(2)}€`;
  //First one is internationalizing and seccond one random so we prefer first one at every displaying number

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = FormatCurrency(Math.abs(out).toFixed(2),acc.locale,acc.currency)//`${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = FormatCurrency(interest.toFixed(2),acc.locale,acc.currency)//`${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const startLogoutTimer = function(){
  //Update the time on UI after every second
  //Stop the timer on 0 second and logout the user
  //Decreased 1s
  //Call the timer after every 1s.
  const tick=function(){
    const min =String(Math.trunc(time/60)).padStart(2,0);
    const seconds = String(time%60).padStart(2,0);
    labelTimer.textContent=`${min}:${seconds}`;

    time--;
    if(time===0){
      clearInterval(timer);
      labelWelcome.textContent = "Login to get started";
      containerApp.style.opacity=0;
    }
  };
  let time =120;
  tick();
  //invocking tick because after login again timer starts from old logout time
  const timer = setInterval(tick,1000)
}
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
//Fake login account

// currentAccount = account1;
// containerApp.style.opacity = 100;
// updateUI(currentAccount)

//Updating labelDate
let currentAccount;
//labelDate.textContent = `$${month}/${year}`;
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  const currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
      }`;


      const dateNow = new Date();
      const day = `${dateNow.getDate()}`.padStart(2,0);
      const month = `${dateNow.getMonth()}`.padStart(2,0);
      const year = `${dateNow.getFullYear()}`.padStart(2,0);
      const hours = `${dateNow.getHours()}`.padStart(2,0);
      const minutes = `${dateNow.getMinutes()}`.padStart(2,0);
      labelDate.textContent = `${day} / ${month} / ${year} ,${hours}: ${minutes}`;
      containerApp.style.opacity =100;
      const options = {
        hours:"numeric",
        minutes:"numeric",
        day:"numeric",
        month:"long",
        year:"numeric"
      }
      // labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(dateNow);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
      startLogoutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor((inputLoanAmount.value));

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(()=>{
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
  
      // Update UI
      updateUI(currentAccount);
    })
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// const now = new Date();
// const options = {
//   hours:"numeric",
//   minutes:"numeric",
//   day:"numeric",
//   month:"numeric",
//   weekday:"long",
//   year:"numeric"
// }
// const intDate = new Intl.DateTimeFormat('en-US',options).format(now);
// console.log(intDate);

//For dynamically changing the customer currency format
const num = 324456456.23;
const option ={
  style:"currency",           //style:"unit"
  currency:"INR"   //Units may be celsius kilometer-per-hour Liter,etc. check mdn documentation
}
console.log(num);
console.log("US                 ",new Intl.NumberFormat('en-US',option).format(num));
console.log("Germany                 ",new Intl.NumberFormat('de-DE',option).format(num));
console.log("Syria                 ",new Intl.NumberFormat('ar-SY',option).format(num));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//Timers in Javascript for functions
//1---------->setTimeout
console.log("I am ordering pizza");
const ing =["olive","Mushroom"];
const pizzatimer = setTimeout((ing1,ing2)=>{     //To cancel setTimeout we have to assign it to variable
  console.log("Hello Nakul this is timer for ur function execution");
  console.log(`Here is ur pizza🍕 with ${ing1} and ${ing2}`)
},5000,...ing);   //We are not invocking this function so we have to give parameters just after timer

console.log("here is my pizza"); //Ideally first execute I am then function and then waiting but due to timer 1st then 3rd and then  function
//This is called asynchronous behaviour of javascript
if(ing.includes('olive')){
    clearTimeout(pizzatimer);
}


//Numbers   + is used to replace Number keyword for type conversion
// console.log(0.1+0.2); //0.3
// console.log(0.1+0.2 === 0.3)//false due to decimal means binary or decimal
// console.log(23);
// console.log(Number(23));
// console.log(+'23');
// console.log(Number.parseInt('45rem'));
// console.log(Number.parseFloat('45px'));
// //Checks if value is number
// console.log(Number.isNaN('23'));//It is number thats why false
// //Chechk if value is finite
// console.log(Number.isFinite(23/0));

// //-----------*******Math
// console.log(Math.sqrt(25));
// console.log(25**(1/2));
// console.log(Math.max(12,45,8,900));
// console.log(Math.min(12,65,87,1));
// console.log(Math.PI.toFixed(2));
// console.log((Math.PI* parseFloat('23px')**2).toFixed(2));    //Area of circle
// console.log(Math.trunc(Math.random()*7+1));     //trunc for integer part
// //Universal function for random numbers
// const randomNum = (max,min)=>  Math.trunc(Math.random()*(max-min)+min);
// /-----------*******/Rounding Integers
// console.log(randomNum(10,20));
// console.log(Math.round(23.3));  //23
// console.log(Math.round(23.9));  //24

// console.log(Math.ceil(23.3));   //24
// console.log(Math.ceil(23.9)); //24

// console.log(Math.floor(23.3));  //23
// console.log(Math.floor(23.946));  //23

// //-----------*******Rounding Decimals
// console.log(2.7.toFixed(0))//3 it gives string not a number
// console.log(+(2.745).toFixed(2));

//-----------*******Modulus Operator
// console.log(123%2);//1
// console.log(234%4);
// const isEven = n => n%2===0
// console.log(isEven(23));
// console.log(isEven(24));
// labelBalance.addEventListener('click',function(){
//     [...document.querySelectorAll('.movements__row')].forEach((row,i) => {
//     if(i%2===0)
//     row.style.backgroundColor = "red";
//     if(i%3===0)
//     row.style.backgroundColor = "blue";
//   })
// })
//-----------*******Numeric seperator     benefitial for readiability
// 23,45,000
// console.log(23_45_000); //Its only for visual representation
// //23__45_00 consectuive double underscore not allowed
// console.log(Number('23000'));//23000
// console.log(parseInt('230_000'));//230
//-----------******* BigInt Numbers
// console.log(2**53 -1);//This is the biggest number JS can hold
// console.log(Number.MAX_SAFE_INTEGER);//This is also same as above   If we do any operation to this number then it wil gwt mess up
// console.log(BigInt(32412581568145435345345n));    //Add BigInt after the number to validate number 
// //Operations are done only BigInt with BigInts
// console.log(20n === 20); //20n is of BigInt type and 20 is of number

//---------------**************Dates in Javascript
// const now = new Date();
// console.log(now);
// console.log(new Date('Jan 15 2015'));
// console.log(new Date(2028,7,13,23,34,5)); //month is 7 still Gives August because month starts from 0
// console.log(account1.movementsDates[0]);
// console.log(new Date(2028,6,33))  //July is of only 31 days bt we give 33 so It gives august 2nd due to 33 value
// console.log(new Date(0)) // Standard epochs time 1 Jan 1970
// console.log(new Date(3* 24*60*60*1000)); // 3 days after epochs time days have 24 hr has 60 min has 60 sec has 1000msec
// //Working with dates
// const future = new Date();
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.toISOString());

//Prforming operations on dates
// const future = new Date(2028,10,19,15,45);
// console.log(future);
// const calcDaysPassed = (date1 , date2) =>
//  Math.abs(date2 -date1) /(1000*60*60*24)  //this is because of 1000msec 60 min 60 sec and 24 hrs
// const daysPassed = calcDaysPassed(new Date(2028,10,19), new Date(2028,10,29));
// console.log(daysPassed);


