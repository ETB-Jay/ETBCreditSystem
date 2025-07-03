# 💰 | crETBle
The Enter the Battlefield (ETB) credit system originally designed by Michael Zhang using [React.js](https://react.dev/), [Electron.js](https://www.electronjs.org/), and [tailwindcss](https://tailwindcss.com/). It is primarily written in [Typescript](https://www.typescriptlang.org/).

[Firebase (Firestore)](https://firebase.google.com/) is used as the backend for this project. The app was built and packaged with [Electron-Builder](https://www.electron.build/index.html).

# 📝 | FEATURES AND USAGE
![ETB Credit Display](https://github.com/user-attachments/assets/60b37b05-3f5a-41ec-9138-0baa79119deb)


- **Search Bar:** Filters by a customer's first and last name. 

- **Adding a new Customer:** Adds a new customer to the system. Email and Phone number are not required but must be formatted correctly if inputted (i.e. 9053382209 with no dashes or brackets). 

- **Information:** A report containing the system's current number of customers, total credit, and number of outstanding individuals. Also includes the download button that lets the user get the current system's logs. 

- **Filters:** Filters the transactions by date, amount transferred, and the employee's name

- **Customer Notes:** Customer notes for each individual. These are universal across all stores

- **Customer Specific Changes:** Buttons that add a new transaction, edit the current customer, and delete the customer.

### <ins>🤔 | Other Important Notes</ins>
- The table of transactions is sorted by date with the most recent transactions at the top
- The employee names when creating transactions are stored in localStorage, not in firebase. This means each system will have their own list of employees. 
- A customer with an outstanding balance will have a warning symbol (⚠️) next to their name in the customer list and their balance.

### <ins>📰 | Getting Logs</ins>	 
The Report contains a download button that allows the user to download a zip file containing two csv files with the customers and transactions. 

**NOTE:** This format is different from what is displayed in Firebase (since it is a NoSQL nonrelational database instead of a SQL relational database). As a result, it cannot be directly plugged into the Firebase database and will require seperate code to change the `.csv` format to a `.json`. See [https://github.com/ETB-Jay/ETBCreditLogs](https://github.com/ETB-Jay/ETBCreditLogs) for how to upload credit logs from a different system to Firestore. 

### <ins> 🤵 | Creating New Authentication Emails/Passwords </ins>
1. Go to the Firebase Console and Login.
2. Under 'Authentication', add a new user.
3. ETBCredit will now automatically update to include the new email and password as valid credentials. 

# 🖥️ | DOWNLOAD 
1. Open the 'Releases' Tab on the right and download `ETBCredit-Setup-<version>.exe`
2. If necessary, allow permissions to install the `.exe`. The credit system is be 100% safe (assuming no one has touched it). 

# 🐛 | UPDATES AND BUG FIXING
From 2025-05-05 to 2025-08-29, Michael Zhang will be conducting preliminary updates and bug fixing as the store adapts to the system. Please ask either Jay or Kris to get his contact information.

After this period, it will be the responsibility of the new "tech guy" to manage the system. For additional information regarding the repository and any creditionals (i.e. Environment Variables, API Keys), please either create new ones for the system or contact Michael through Jay or Kris to obtain the old ones.

## 📓 | Notes on Firebase
As of 2025-06-27, firestore offers two payment plans: spark and blaze. ETB is currently on the spark plan, which limits the number of API calls that we can make to firestore. Please make sure to update the system to the blaze plan once the store reaches the spark plan limits. 

## 📚 | Tech Stack 
- **Frontend:** ReactJS (Typescript), ElectronJS
- **Styling:** TailwindCSS
- **Backend:** Firebase (Firestore)
- **State Management:** React Context
- **Build Tools:** Vite
- **Publish and Update Tools:** Electron-Builder
- **Testing Tools:** Vitest/Jest

## 🛒 | Development 
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
