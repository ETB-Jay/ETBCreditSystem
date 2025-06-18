# ETB Credit System 💰
The Enter the Battlefield (ETB) credit system designed by Michael Zhang using [React.js](https://react.dev/), (Electron.js)[https://www.electronjs.org/], and (tailwindcss)[https://tailwindcss.com/].

[Firebase (Firestore)](https://firebase.google.com/) is used as the backend for this project. The app was packaged with (Electron-Builder)[https://www.electron.build/index.html]

# FEATURES AND USAGE 📝
![ETB Diagram](https://github.com/user-attachments/assets/64bd72c6-ff43-454d-9896-3495e631d3b9)


**1 - Search Bar:** Filters by a customer's first and last name. 

**2 - Adding a new Customer:** Adds a new customer to the system. Email and Phone number are not required but must be formatted correctly if inputted.

**3 - Information:** A report containing the system's current number of customers, total credit, and number of outstanding individuals. Also includes the download button that lets the user get the current system's logs. 

**4 - Filters:** Filters the transactions by date, amount transferred, and the employee's name. 

**5 - Customer Specific Changes:** Buttons that add a new transaction, edit the current customer, and delete the customer respectively

### <ins>Other Important Notes</ins> 🤔
- The transaction list is sorted by date (most recent at the top)
- A customer with an outstanding balance will have a warning symbol next to their name in the customer list and their balance.
- `CTRL + R` reloads the app display. This command is useful when the app needs to be reloaded to access new data inputted directly into firestore or from another device with the credit system. **PLEASE DO NOT SPAM THIS COMMAND ☹️**

### <ins>Getting Logs 📰</ins>	 
The Report contains a download button that allows the user to download a zip file containing two csv files with the customers and transactions. 

**NOTE:** This format is different from what is displayed in Firebase (since it is a NoSQL nonrelational database instead of a SQL relational database). As a result, it cannot be directly plugged into the Firebase database and will require seperate code to change the `.csv` format to a `.json`. See [https://github.com/ETB-Jay/ETBCreditLogs](https://github.com/ETB-Jay/ETBCreditLogs) for how to upload credit logs from a different system to Firestore. 

# DOWNLOAD 🖥️
1. Open the 'Releases' Tab on the right and download `ETBCredit-Setup-<version>.exe`
2. If necessary, allow permissions to install the `.exe` (I promise this app is secure 😊)

# UPDATES AND BUG FIXING 🐛
From 2025-05-05 to 2025-08-29, I will be conducting preliminary updates and bug fixing as the store gets used to the system. Please ask either Jay or Kris to get my contact information if you have questions or have noticed any bugs.

After this period (post my co-op), I will be copying the source files to a different computer but will keep a copy for myself. If you would like to know more about the source material OR need information that I have not uploaded to github (i.e. Enviornment Variables, API keys), then you can contact Jay or Kris to get my contact information. Please do not hesitate to ask me if you have questions about the code. I am also open to doing bug fixes while I am away and back at school.

## Tech Stack 📚
- Frontend: ReactJS, ElectronJS
- Styling: TailwindCSS
- Backend: Firebase (Firestore)
- State Management: React Context
- Build Tools: Vite
- Publish Tools: Electron-Builder

## Development 🛒
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
5. Publishing (need access to enviornment variable):
   ```bash
   Remove-Item -Recurse -Force release-builds; $env:GH_TOKEN = (Get-Content .env | Select-String "GH_TOKEN").ToString().Split("=")[1].Trim()
   npm run publish
   ```
   
## License 🕴️

UNLICENSED - All rights reserved
