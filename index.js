const axios = require("axios");

axios.get('https://climateaction.unfccc.int/apiv2/actor/country/USA', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  },
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});
