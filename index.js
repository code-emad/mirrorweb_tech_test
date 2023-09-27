const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs/promises'); // Import the fs module with promises support

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto('https://climateaction.unfccc.int/apiv2/actor/country/USA');

  // Extract the page content
  const pageContent = await page.content();

  // Load the HTML content into Cheerio
  const $ = cheerio.load(pageContent);

  // Find the <pre> element containing JSON data
  const jsonText = $('pre').text().trim();

  // Check if the JSON data is not empty
  if (jsonText) {
    try {
      // Parse the JSON data into a JavaScript object
      const jsonData = JSON.parse(jsonText);

      // Write the response data to a JSON file
      await fs.writeFile('responseUSA.json', JSON.stringify(jsonData, null, 2));

      console.log('JSON Data saved to response.json');
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  } else {
    console.error('No JSON data found in the response.');
  }

  // Close the browser
  await browser.close();
})();
