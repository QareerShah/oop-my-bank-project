#! /usr/bin/env node
import inquirer from "inquirer";

// Bank Account interface
interface IBankAccount {
    accountNumber: number;
    balance: number;
    withdraw(amount: number): void;
    deposit(amount: number): void;
    checkBalance(): void;
}

// Bank Account Class
class BankAccount implements IBankAccount {
    accountNumber: number;
    balance: number;

    constructor(accountNumber: number, balance: number) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    // Debit Money
    withdraw(amount: number): void {
        if (this.balance >= amount) {
            this.balance -= amount;
            console.log(`Withdraw of $${amount} successful. Remaining balance is: $${this.balance}`);
        } else {
            console.log("Insufficient balance.");
        }
    }

    // Credit Money
    deposit(amount: number): void {
        if (amount > 100) {
            amount -= 1; // $1 fee charged if more than $100 is deposited
        }
        this.balance += amount;
        console.log(`Deposit of $${amount} successful. Remaining balance: $${this.balance}`);
    }

    // Check Balance
    checkBalance(): void {
        console.log(`Current balance is $${this.balance}`);
    }
}

// Customer class
class Customer {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    mobileNumber: number;
    account: BankAccount;

    constructor(firstName: string, lastName: string, gender: string, age: number, mobileNumber: number, account: BankAccount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}

// Create bank accounts
const accounts: BankAccount[] = [
    new BankAccount(9001, 1000),
    new BankAccount(9002, 4000),
    new BankAccount(9003, 2000),
];

// Create customers
const customers: Customer[] = [
    new Customer("Syed", "Asad", "Male", 24, 3163467895, accounts[0]),
    new Customer("Syeda", "Qareer", "Female", 20, 3333467895, accounts[1]),
    new Customer("Syed", "Anwar", "Male", 45, 3413467895, accounts[2]),
];

// Function to interact with bank account
async function service() {
    do {
        const { accountNumber } = await inquirer.prompt([{
            name: "accountNumber",
            type: "input",
            message: "Enter your account number:",
            validate: (input) => !isNaN(Number(input)) || "Please enter a valid number"
        }]);

        const customer = customers.find(customer => customer.account.accountNumber === Number(accountNumber));
        if (customer) {
            console.log(`Welcome, ${customer.firstName} ${customer.lastName}!\n`);
            const { Select } = await inquirer.prompt([{
                name: "Select",
                type: "list",
                message: "Select an operation",
                choices: ["Deposit", "Withdraw", "Check Balance", "Exit"]
            }]);

            switch (Select) {
                case "Deposit":
                    const { amount: depositAmount } = await inquirer.prompt({
                        name: "amount",
                        type: "input",
                        message: "Enter the amount to deposit:",
                        validate: (input) => !isNaN(Number(input)) || "Please enter a valid number"
                    });
                    customer.account.deposit(Number(depositAmount));
                    break;
                case "Withdraw":
                    const { amount: withdrawAmount } = await inquirer.prompt({
                        name: "amount",
                        type: "input",
                        message: "Enter the amount to withdraw:",
                        validate: (input) => !isNaN(Number(input)) || "Please enter a valid number"
                    });
                    customer.account.withdraw(Number(withdrawAmount));
                    break;
                case "Check Balance":
                    customer.account.checkBalance();
                    break;
                case "Exit":
                    console.log("Exiting bank program...");
                    console.log("\nThank you for using our bank services. Have a great day!");
                    return;
            }
        } else {
            console.log("Invalid Account Number. Please try again.");
        }
    } while (true);
}

service();
