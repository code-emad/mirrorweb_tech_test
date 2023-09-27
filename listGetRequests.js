const puppeteer = require('puppeteer');
const fs = require('fs/promises');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  // Create a new page
  const page = await browser.newPage();
  // Define the URL to send the POST request to
  const url = 'https://climateaction.unfccc.int/apiv2/actor/country/list';
  // Define the data to send in the POST request as an object
  const postData = {
    example: 'data',
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

    // Create a result string for the TXT file
    let resultTxt = 'List of GET results:\n';

    // Loop through the countries and build the result string
    responseData.countries.forEach((country, index) => {
      resultTxt += `${index + 1}. "https://climateaction.unfccc.int/apiv2/actor/country/${country.countryISO3}"\n`;
    });
    
    // Write the result to a TXT file
    await fs.writeFile('result.txt', resultTxt);
    // Write the response data to a JSON file
    await fs.writeFile('responseLIST.json', JSON.stringify(responseData, null, 2));
    console.log('POST Response saved to responseLIST.json');
    console.log('Result saved to result.txt');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();
