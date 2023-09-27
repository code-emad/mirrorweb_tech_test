const puppeteer = require('puppeteer');
const fs = require('fs/promises'); // Import the fs module with promises support

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Define the URL to send the POST request to
  const url = 'https://climateaction.unfccc.int/apiv2/actor/country/list';

  // Define the data to send in the POST request as an object
  const postData = {
    key1: 'value1',
    key2: 'value2',
  };

  // Convert the data to a JSON string
  const postDataString = JSON.stringify(postData);

  try {
    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle0', // Wait until the network is idle
    });

    // Send a POST request using the fetch API in the browser context
    const response = await page.evaluate(async (url, data) => {
      const fetchResponse = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return fetchResponse.text();
    }, url, postDataString);

    // Parse the response data into a JavaScript object
    const responseData = JSON.parse(response);

    // Write the response data to a JSON file
    await fs.writeFile('response.json', JSON.stringify(responseData, null, 2));

    console.log('POST Response saved to response.json');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();
