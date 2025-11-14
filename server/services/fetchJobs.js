const axios = require("axios");
const xml2js = require("xml2js");

async function fetchXML(url) {
  const res = await axios.get(url);
  const parser = new xml2js.Parser({
    explicitArray: true,
    strict: false,
    normalizeTags: true,
    mergeAttrs: true,
  });
  return parser.parseStringPromise(res.data);
}

module.exports = fetchXML;
