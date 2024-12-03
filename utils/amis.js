const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');

async function fetchCommodityPrices(commodityId, date = null) {
    try {
        // Set the URL and form data
        const url = `http://www.amis.pk/ViewPrices.aspx?searchType=0&commodityId=${commodityId}`;
        const formData = new URLSearchParams({
            'ctl00$cphPage$ReminderButton': 'Show prices',
            'Radio': 'on',
            '__VIEWSTATEGENERATOR': 'DD2094E3',
            '__EVENTTARGET': '',
            '__EVENTARGUMENT': '',
            'ctl00$cphPage$height': '',
            'ctl00$cphPage$myInput': '',
        });
        
        // Only add date to the form data if it is provided
        if (date) {
            formData.append('ctl00$cphPage$DateTextBox', date);
        }

        // Send the POST request
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        
        const html = await response.text();

        // Load the response data into Cheerio for parsing
        const $ = cheerio.load(html);
        
        // Extract the commodity name
        const commodity = $('#ctl00_cphPage_lblMsg').text().trim();

        // Parse the date
        const displayedDate = date ? date : $('#ctl00_cphPage_Grd table tbody tr:first-child td:first-child').text().replace('Dated:', '').trim();

        // Extract the price data
        const prices = [];
        $('#ctl00_cphPage_Grd table tbody tr').each((index, row) => {
            if (index === 0) return; // Skip header row

            const cells = $(row).find('td');
            // const city = cells.eq(0).text().trim().split(' ')[1];
            const cityAnchor = $(cells[0]).find('a');
            const city = cityAnchor.length > 0 ? cityAnchor.text().trim() : $(cells[0]).text().trim().split(' ')[1] || null;

            
            const min = cells.eq(2).text().trim();
            const max = cells.eq(3).text().trim();
            const fqp = cells.eq(4).text().trim();
            const quantity = cells.eq(5).text().trim();

            prices.push({
                city: city,
                min: min === '-' ? null : parseFloat(min),
                max: max === '-' ? null : parseFloat(max),
                fqp: fqp === '-' ? null : parseFloat(fqp),
                quantity: quantity === '-' ? null : parseFloat(quantity)
            });
        });

        // Return the data in the required format
        return {
            commodity,
            date: displayedDate,
            prices
        };

    } catch (error) {
        console.error('Error fetching commodity prices:', error);
        throw error;
    }
}

// Helper function to calculate the average of an array
function calculateAverage(values) {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

function getMonthName(month){
    if (month == 1){
        return "JAN";
    } else if (month == 2){
        return "FEB";
    } else if (month == 3){
        return "MAR";
    } else if (month == 4){
        return "APR";
    } else if (month == 5){
        return "MAY";
    } else if (month == 6){
        return "JUN";
    } else if (month == 7){
        return "JUL";
    } else if (month == 8){
        return "AUG";
    } else if (month == 9){
        return "SEP";
    } else if (month == 10){
        return "OCT";
    } else if (month == 11){
        return "NOV";
    } else if (month == 12){
        return "DEC";
    }
}

// Helper function to group data by date range
function groupData(data, startDate, endDate, groupBy) {
    const grouped = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    data.forEach((entry) => {
        const entryDate = new Date(entry.date);
        if (entryDate >= start && entryDate <= end) {
            const groupKey =
                groupBy === 'month'
                    ? `${entryDate.getFullYear()}-${ getMonthName(entryDate.getMonth() + 1)}`
                    : groupBy === 'week'
                    ? entryDate.getDate()
                    : entry.date;

            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(entry);
        }
    });

    return grouped;
}


module.exports = { fetchCommodityPrices, calculateAverage, groupData };