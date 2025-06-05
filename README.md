# ETB Credit System
A Credit System designed by Michael Zhang using React.js, Electron.js, and tailwindcss. 

[Firebase](https://firebase.google.com/) is used as the backend for this project.

# FEATURES AND USAGE
![image](https://github.com/user-attachments/assets/835b59c0-2b57-47c2-a291-ac69233d9349)

**1 - Search Bar** Filters by first AND last name, but NOT by email.

**2 - '+' Icon** Adds a new customer to the system. 

**3 - Information Icon** Displays a log containing the current number of users, total credit in the system, and the number of outstanding balances.

**4 - Filter Icon** Filters the transactions. Includes filters for date, amount transfered, and the employee's name. 

**5 - Triple Dot Icon** Allows the user to choose between adding a new transaction OR editing the current user's information

## Other Notes
- The transaction list is sorted by date (most recent at the top)
- A customer with an outstanding balance will have a warning symbol next to their name in the customer list and their balance.
- `CTRL + R` reloads the app display. This command is important as the app does not update dynamically if another device creates a transaction (although it will if you create a new customer/transaction).
  
**DO NOT SPAM THIS COMMAND. THERE ARE A LIMITED NUMBER OF API CALLS AND WASTING THEM WILL COST A LOT OF MONEY ☹️💸**

## Getting Logs
<del>read: [https://github.com/ETB-Jay/ETBCreditLogs](https://github.com/ETB-Jay/ETBCreditLogs)</del>

The "download" button is located in the information icon prompt. It will download a zip file containing the current list of customers and transactions.

**NOTE:** This format is different from what is displayed in Firebase (since it is a NoSQL, nonrelational database instead of a SQL, relational database). As a result, it cannot be directly plugged into the Firebase database and will require seperate code to change the `.csv` format to a `.json`.

# DOWNLOAD
1. Open the 'Releases' Tab on the right and download `ETBCredit-Setup-<version>.exe`
2. If necessary, allow permissions to install the `.exe` (I promise there are no viruses and that I'm the publisher 😊)
3. Begin!

# UPDATES AND BUG FIXING
From 2025-05-05 to 2025-08-29, I will be doing updates and bug fixing. Please ask either Jay or Kris to get my contact information.

After this period (post my co-op), I will be copying the source files to a different computer but will keep a copy for myself (this includes any enviornment variables). If you are the new "tech guy" and would like to know more about the source material or need help with updates, you can contact Jay or Kris again to get my contact information. I am also open to doing bug fixes during the time when I am back in school so please do not hesitate to contact me.

## Tech Stack
- Frontend: ReactJS, ElectronJS
- Styling: TailwindCSS
- Backend: Firebase (Firestore)
- State Management: React Context
- Build Tools: Vite

## Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build the application:
   ```bash
   npm run build
   ```
5. Publishing:
   ```bash
   Remove-Item -Recurse -Force release-builds; $env:GH_TOKEN = (Get-Content .env | Select-String "GH_TOKEN").ToString().Split("=")[1].Trim()
   npm run publish
   ```

## License

UNLICENSED - All rights reserved
