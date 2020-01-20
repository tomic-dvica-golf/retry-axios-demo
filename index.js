const axios = require("axios");
const attach = require("retry-axios").attach;

const myInstance = axios.create({ baseURL: "https://google.com" });

attach(myInstance);

module.exports = { myInstance };
