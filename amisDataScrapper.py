import os
import requests
import json
from datetime import datetime, timedelta

# Create a directory to store the data
os.makedirs("data", exist_ok=True)

# Define the base URL
BASE_URL = "http://localhost:3000/amis/commodity/price"

# Calculate the date range
end_date = datetime.now()
start_date = end_date - timedelta(days=2 * 365)  # Approx. 2 years

# Loop through commodity IDs and fetch data
for commodity_id in range(15, 142):
    result_data = {"commodityName": "", "data": []}  # Structure for each commodity
    
    # Loop through each day in the date range
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        params = {
            "commodityId": commodity_id,
            "date": date_str
        }

        try:
            print(f"Fetching data for commodity {commodity_id} on {date_str}...")
            response = requests.get(BASE_URL, params=params)
            response.raise_for_status()

            # Parse the response
            response_data = response.json()
            if not result_data["commodityName"]:
                result_data["commodityName"] = response_data.get("commodity", "")
            result_data["data"].append({
                "date": date_str,
                "prices": response_data.get("prices", [])
            })

        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch data for commodity {commodity_id} on {date_str}: {e}")
        except Exception as e:
            print(f"Error processing data for commodity {commodity_id} on {date_str}: {e}")
        
        # Increment the date
        current_date += timedelta(days=1)

    # Save the result to a JSON file
    output_file = os.path.join("data", f"commodity_{commodity_id}.json")
    try:
        with open(output_file, "w") as file:
            json.dump(result_data, file, indent=4)
        print(f"Data saved for commodity {commodity_id} in {output_file}")
    except Exception as e:
        print(f"Error saving data for commodity {commodity_id}: {e}")
