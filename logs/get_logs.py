from pyairtable import Api
import csv
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

def get_airtable(table_id, api_key):
    table = api_key.table(
        os.getenv("VITE_AIRTABLE_BASE_ID"), 
        table_id
    )
    return table.all()

def to_csv(data, path):
    try:
        filename = f"{datetime.today().strftime('%Y-%m-%d')}.csv"
        fields = data[0]['fields'].keys()
        with open(filename, 'w', newline="") as new_log:
            writer = csv.DictWriter(new_log, fieldnames=fields)
            writer.writeheader()
            for record in data:
                writer.writerow(record['fields'])
        os.rename(f"./{filename}", f"{path}{filename}")
    except Exception as e:
        print("not enough records:", e)
        

if __name__ == "__main__":
    api_key = Api(os.getenv("VITE_AIRTABLE_API_KEY"))
    paths = ['./customers/', './transactions/']
    table_ids = [os.getenv("VITE_AIRTABLE_CUSTOMER_ID"), os.getenv("VITE_AIRTABLE_TRANSACTIONS_ID")]
    for index, table_id in enumerate(table_ids):
        data = get_airtable(table_id, api_key)
        to_csv(data, paths[index])
