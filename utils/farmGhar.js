const fetchAllFarmGharListings = async (searchString) => {
    const url = 'https://mobapp.farmghar.com/v3/ads_list_v2.php';
    let page = 1;
    let allProducts = [];
    
    // Define the initial form data
    const formData = {
        parent_category: 1,
        page: page,
        price: '',
        district: '',
        breed: '',
        min_age: 0,
        s: searchString,
        latitude: null,
        longitude: null,
    };

    try {
        while (true) {
            // Send POST request
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // If the response status is 404, break the loop
            if (response.status === 404) {
                console.log('No more pages found. Ending search.');
                break;
            }

            // Parse the JSON response
            const data = (await response.json()).data;

            // If no products are found in the response, break the loop
            if (!data || data.length === 0) {
                console.log('No products found on this page. Ending search.');
                break;
            }

            // for each item in data send a request to the url 
            data.forEach(async item => {
                const itemResponse = await fetch('https://mobapp.farmghar.com/v3/ad_list.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"id": item.id, "key":null}),
                });

                const itemData = await itemResponse.json();
                
                allProducts = [...allProducts, ...(itemData.data)];
            })
        
            // Increment the page number for the next request
            page += 1;
            formData.page = page;

            console.log(`Fetched ${data.length} products from page ${page - 1}`);
        }

        return allProducts;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};


module.exports = fetchAllFarmGharListings;