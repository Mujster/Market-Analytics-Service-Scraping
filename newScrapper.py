import os
import requests
import json
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

# Create a directory to store the data
os.makedirs("data", exist_ok=True)

# Define the base URL
BASE_URL = "http://www.amis.pk/ViewPrices.aspx"

# Calculate the date range
end_date = datetime.now()
start_date = end_date - timedelta(days=2 * 365)  # Approx. 2 years

def fetch_commodity_prices(commodity_id, date=None):
    try:
        # Prepare form data
        form_data = {
            'ctl00$cphPage$ReminderButton': 'Show prices',
            'Radio': 'on',
            '__VIEWSTATEGENERATOR': 'DD2094E3',
            '__EVENTTARGET': '',
            '__EVENTARGUMENT': '',
            'ctl00$cphPage$height': '',
            'ctl00$cphPage$myInput': '',
        }

        # Add date to the form data if provided
        if date:
            form_data['ctl00$cphPage$DateTextBox'] = date

        # Send the POST request
        response = requests.post(
            BASE_URL,
            data=form_data,
            params={'searchType': '0', 'commodityId': commodity_id}
        )
        response.raise_for_status()
        html = response.text

        # Parse the HTML using BeautifulSoup
        soup = BeautifulSoup(html, 'html.parser')

        # Extract the commodity name
        commodity = soup.find('span', {'id': 'ctl00_cphPage_lblMsg'}).get_text(strip=True)

        # Extract the displayed date
        displayed_date = date if date else soup.select_one(
            '#ctl00_cphPage_Grd table tbody tr:first-child td:first-child'
        ).get_text(strip=True).replace('Dated:', '')

        # Extract price data
        prices = []
        rows = soup.select('#ctl00_cphPage_Grd table tbody tr')[1:]  # Skip header row
        for row in rows:
            cells = row.find_all('td')
            city_anchor = cells[0].find('a')
            city = city_anchor.get_text(strip=True) if city_anchor else cells[0].get_text(strip=True).split(' ')[1]
            min_price = cells[2].get_text(strip=True)
            max_price = cells[3].get_text(strip=True)
            fqp = cells[4].get_text(strip=True)
            quantity = cells[5].get_text(strip=True)

            prices.append({
                'city': city if city else None,
                'min': None if min_price == '-' else float(min_price),
                'max': None if max_price == '-' else float(max_price),
                'fqp': None if fqp == '-' else float(fqp),
                'quantity': None if quantity == '-' else float(quantity),
            })

        # Return the data in the required format
        return {
            'commodity': commodity,
            'date': displayed_date,
            'prices': prices,
        }

    except Exception as e:
        print(f"Error fetching commodity prices for commodity {commodity_id} on {date}: {e}")
        return None


# Fetch data for commodities and save to files
for commodity_id in range(21, 142):
    result_data = {"commodityName": "", "data": []}  # Structure for each commodity

    # Loop through each day in the date range
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        print(f"Fetching data for commodity {commodity_id} on {date_str}...")
        
        fetched_data = fetch_commodity_prices(commodity_id, date_str)
        if fetched_data:
            if not result_data["commodityName"]:
                result_data["commodityName"] = fetched_data["commodity"]
            result_data["data"].append({
                "date": fetched_data["date"],
                "prices": fetched_data["prices"],
            })
        
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
