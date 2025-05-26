# ETB Credit System
Created by Michael Zhang using ReactJS, ElectronJS, and TailwindCSS. Airtable was used as the backend for this project.

https://github.com/elphoun

# USAGE
Current Supported Features:
- Adding Customers
- Editing Current Customers
- Adding Transactions
- Report that displays current system statistics.

# BACKUP AND LOGS
`get_logs.py` will allow the user to automatically backup the Airtable data. However, [Cron](https://en.wikipedia.org/wiki/Cron) or some equivalent must be used in order to execute the file every 24 hours. 

1. Install [Ubuntu](https://ubuntu.com/)
2. Search for and open Ubuntu in the start menu
3. Run the command `crontab -e`. Then select any of the given options if no crontab commands have been written on your device yet. 
4. Write your [Crontab Line](https://help.ubuntu.com/community/CronHowto).
5. Done! Save the file.
