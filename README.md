# ETB Credit System
The Enter the Battlefield credit system. 

Created by Michael Zhang using [React.js](https://react.dev/), [Electron.js](https://www.electronjs.org/), and [tailwindcss](https://tailwindcss.com/). 

[Airtable](https://airtable.com/) was used as the backend for this project.

# FEATURES AND USAGE
![Diagram](https://github.com/user-attachments/assets/3300ef59-6352-40ee-8771-23c8bac26f9b)

**1 - Search Bar** Filters by first AND last name, but NOT by email.

**2 - '+' Icon** Adds a new customer to the system. 

**3 - Information Icon** Displays a log containing the current number of users, total credit in the system, and the number of outstanding balances.

**4 - Filter Icon** Filters the transactions. Includes filters for date, amount transfered, and the employee's name. 

**5 - Triple Dot Icon** Allows the user to choose between adding a new transaction OR editing the current user's information

## Other Notes
- The transaction list is sorted by date (most recent at the top)
- A customer with an outstanding balance will have a warning symbol next to their name in the customer list and their balance.
- Transactions will display as green if they are a credit transaction and red if they are a debit transaction
- `CTRL + R` reloads the app display. This command is important as the app does not update dynamically if another device creates a transaction (although it will if you create a new customer/transaction). **DO NOT SPAM THIS COMMAND. WE HAVE A LIMITED NUMBER OF API CALLS AND THIS WILL WASTE THEM**

## Getting Logs
read: [https://github.com/ETB-Jay/ETBCreditLogs](https://github.com/ETB-Jay/ETBCreditLogs)

# DOWNLOAD
1. Open the 'Releases' Tab on the right and download `ETBCredit Setup <version>.exe`
2. If necessary, allow permissions to install the `.exe` (I promise there are no viruses and that I'm the publisher 😊)
3. Begin!

# UPDATES AND BUG FIXING
From 2025-06-03 to 2025-08-29, I will be doing updates and bug fixing. Please contact either Jay or Kris to get my contact information.

After this period (post co-op), I will be copying the source files to a different computer but will keep a copy for myself (this includes any enviornment variables). If you are the new "tech guy" and would like to know more about the source material or need help with updates, you can contact Jay or Kris again to get my contact information. I am also open to doing bug fixes during the time when I am back in school so please do not hesitate to contact me.
