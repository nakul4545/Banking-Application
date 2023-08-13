const account1 ={
    owner:"Nakul Patil",
    movements:[410,600,-200,-100,3000,500,2300],
    interest:1.2,
    pin:1111
}
const account2 ={
    owner:"Ashok Patil",
    movements:[300,-200,-500,-700,3300,500],
    interest:1.5,
    pin:2222
}   //In dummy JSON objects keys also have "" means here owner is like "owner"
const account3 ={
    owner:"Urvashi Patil",
    movements:[300,200,-900,-200,1000,700],
    interest:1.7,
    pin:3333
}
const account4 ={
    owner:"Nakul Patil",
    movements:[500,100,-100,-500,3700,500],
    interest:1,
    pin:4444
}
const accounts =[account1,account2,account3,account4];
//Labeling 
const labelwelcome = document.querySelector('.welcome');
const labeldate = document.querySelector('.balance__date');
const labelbalance = document.querySelector('.balance__value');
const labelSumIn= document.querySelector('.summary__label--in');
const labelSumOut= document.querySelector('.summary__label--out');
const labelSumInterest = document.querySelector('.summary__label-interest');
const labelTimer = document.querySelector('.timer');

const containerapp = document.querySelector('.app');
const containerMovements = document.querySelector('.movement')

const btnLogin = document.querySelector('.login__btn');
const btnTranfer = document.querySelector('.form__btn-transfer') ;
const btnLoan = document.querySelector('.form__btn-loan');
const btnClose= document.querySelector('.form__btn-close');
const btnSort = document.querySelector('.btn--sort');

//Target all input fields

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input-to');
const inputTransferAmount = document.querySelector('.form__input-amount');
const inputLoanAmount = document.querySelector('.form__input-loan-amount');
const inputCloserUsername = document.querySelector('.form__input-user');
const inputCloserPin = document.querySelector('.form__input-pin')

//Manipulating and inserting DOM dynamically
const movements=[400,600,-200,-100,300,500];
const displayMovements = function(movements){
    containerMovements.innerHTML = '';  //Because it gives default transaction values
    movements.forEach(function(mov,i){

        
            const type = mov >0 ? 'deposit' : 'withdrawal';
            const html = `<div class="movement-row">
            <div class="movement__type movement__type--${type}">${i+1} ${type}</div>
            
            <div class="movement_value">${mov} EUR</div>
        </div>`
        containerMovements.insertAdjacentHTML('afterbegin',html);       //'beforeend' display in reverse order
    });
}
// displayMovements(account1.movements);

//We have to create username for above accounts users
const createUsername = function(accs){
    accs.forEach(function(acc){
        acc.username = acc.owner.toLowerCase().split(" ").map(name => name[0]).join('')
    }) 
}
createUsername(accounts);
console.log(accounts);

const deposits = movements.filter((mov)=>{
    return mov >0;
})
console.log(deposits);  //By filtering method
//Use filter for withdrawals
const withdrawals = movements.filter((mov =>mov<0))
console.log(withdrawals);
//By forof loop method
const depositsof = [];
for (const mov of movements){
    if(mov>0){
        depositsof.push(mov);
    }
}
console.log(depositsof);

//Reduce Method for returning single value in array
//Here we return total balance of account by adding accumulator to movements and the value 0 is set to accumulator
const transactions=[400,600,-200,-100,3000,500];
const balance = transactions.reduce(function(acc , mov , i ,array){
    console.log(`Iteration:${i+1} acc value is ${acc}`);
    return acc +mov;
},0)
console.log(balance);

//Show balance using forof loop
var balanceof =0;

for (const val of transactions){
    balanceof += val;
}
console.log(balanceof)

//----------------------------***********Reduce method
//We have to display the total balance of account at UI
calculateDisplayBalance = function(acc){    //Takes any account
    acc.balance = acc.movements.reduce((acc,mov)=>{
        return acc +mov;
    },0)
    console.log("The Final balance is:",acc.balance);
    labelbalance.textContent=`${acc.balance}EUR`
    // labelbalance.innerHTML=('');
    // labelbalance.insertAdjacentHTML('afterbegin',`$${balance}`);
}
// calculateDisplayBalance(account1);
//*Reduce is also used for Finding max among array
// const max = movements.reduce((acc,mov)=>{
    //     if(acc>mov) return acc;
    //     else return mov
    // },movements[0]);
    // console.log(max);
//----------------------------***********Update the summary
const calDisplaySummary = function(acc){
    const income = acc.movements.filter(mov => mov >0).reduce((acc,mov)=> mov+ acc,0);
    console.log(`Displayed Incomes is ${income}`);
    labelSumIn.textContent = `${income}EUR`
    const outcome = acc.movements.filter(mov => mov <0).reduce((acc,mov)=> acc+mov ,0);
    labelSumOut.textContent = `${Math.abs(outcome)}EUR`
    const interest = acc.movements.filter(mov => mov>0).map(deposit => (deposit *acc.interest)/100).reduce((acc,mov)=> acc+mov,0);
    labelSumInterest.textContent = `${interest.toFixed(2)}EUR`
}
// calDisplaySummary(account1);
//----------------------------***********Find method
const firstwithdrawal = movements.find(mov => mov <0);
console.log(firstwithdrawal);
const accountname = accounts.find((acc)=>{
    return acc.owner === "Nakul Patil";
})
console.log(accountname);

//Adding functionality to login button
let currentAccount;
btnLogin.addEventListener('click',function(e){
    e.preventDefault();
    //If enter username == acc.username then it is found
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
    if(currentAccount?.pin === Number(inputLoginPin.value)){
        labelwelcome.textContent=`Welcome back ${currentAccount.owner.split(" ")[0]}`;
        containerapp.style.opacity = 100;
        //clear input fields
        inputLoginUsername.value = inputLoginPin.value =" ";
        updateUI(currentAccount);
    }
})
//Update UI after making transactions
const updateUI = function(acc){
    displayMovements(acc.movements)
    calculateDisplayBalance(acc);
    calDisplaySummary(acc);
}
//Adding functionality to operations
 btnTranfer.addEventListener('click',function(e){
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
    inputTransferTo.value =inputTransferAmount.value=""; //After transfer make it to none
    if(amount>0 &&                                  //Amount should be greater than 0
       receiverAccount &&                       //Receiver account should exists
       currentAccount.balance > amount &&       //Account balance should gt amount entered
       receiverAccount.username !== currentAccount.username     //Not transfer to same account
        ){
                currentAccount.movements.push(-amount); //Deduct
                receiverAccount.movements.push(amount); //Credited
                
                console.log(currentAccount);
                console.log(receiverAccount);
                updateUI(currentAccount);
        }
    

 })

 //Close account functionality
 btnClose.addEventListener('click',function(e){
    e.preventDefault();
    if(inputCloserUsername.value === currentAccount.username && 
        Number(inputCloserPin.value) === currentAccount.pin){
            console.log("Deleting Account");
        }
        //Removing that element from an array of accounts
        const index = accounts.findIndex(acc => currentAccount.username=== acc.username)
        accounts.splice(index,1)
        containerapp.style.opacity = 0;
        inputCloserUsername.value=inputCloserPin.value="";
        labelwelcome.textContent = "Log in to get started";
 })

 //Some method It checks whether any of array and returns boolean
//  const movements=[400,600,-200,-100,300,500];
// console.log(movements.some((mov)=> mov > 0));//returns true because there is amount gt 0 in movements
// console.log(movements.every((mov)=> mov > 0)); //Returns false because there is not every ele gt 0
// //Seperate callback
// const x = mov => mov>0;
// console.log(movements.filter(x));
// console.log(movements.some(x));
// console.log(movements.every(x));
//-------------*************Loan Feature
btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if(amount >0 && currentAccount.movements.some(mov=>  mov >= amount*0.1)){///account has any transaction of 10% requested loan am
        currentAccount.movements.push(amount);
        updateUI(currentAccount);
        inputLoanAmount.value=" ";
    }
})
//----------------------------***********Chaining of operation for Eur to USD 
const eurtousd = 1.1;
// While revision go from bottom to top
// const totaldepositedusd = movements.filter((mov)=>{
//     return mov>0
// }).map((mov,i,arr)=>{
//     // console.log(arr); //Use for debugging
//     return mov * eurtousd;
// }).reduce((acc,mov)=>{
//     return acc + mov;
// },0)
//------------------Shorthand for above method
// const totaldepositedusd = movements.filter(mov =>  mov >0).map(mov => eurtousd* mov).reduce( (acc,mov) => acc+mov ,0)
// console.log(totaldepositedusd);


    //Creating Usernames    Understand this step by step
// const username = "Ashish Kumar Gupta";

// function createUsername(username){
//     return username.toLocaleLowerCase().split(' ').map((name)=>
//     name[0]).join('')
// }
// const shortname = createUsername(username);
// console.log(shortname);
// console.log(username.toLocaleLowerCase().split(' ').map((namee)=>
//     namee[0]
// ).join(''))
//Map method to map every element in an array

// const arr = [200,-400,300,-700,100,200];
// const arr2 = arr.map(function(el){
//     return el*2;
// })
// console.log(arr2);
// //original array remains same
// console.log(arr);
// const movements=[400,600,-200,-100,3000,500];
// const EurtoUsd = 1.1;
// //Using Normal function
// const movementsUsd = movements.map(function(ele){
//         return ele*EurtoUsd;
// })
// console.log(movementsUsd);
// //Using Arrow function
// const movementsUsdd = movements.map((mov)=>{
//     return mov * EurtoUsd;
// })
// console.log(movementsUsdd);

// //Using Arrow shorthand because function returning only one statement
// const movementsUsddd = movements.map((mov => mov*EurtoUsd))

// console.log(movementsUsddd);
// // using for of
// const movementsUsdof = [];
// for (mov of movements){
//     movementsUsdof.push(mov*EurtoUsd);
// }
// console.log(movementsUsdof);

// const movementdescription = movements.map((mov,i)=>
//      `${i+1} Transaction: Money ${mov > 0 ? "Delopsited": "Withdrew"}:${mov}`
// )
// console.log(movementdescription);