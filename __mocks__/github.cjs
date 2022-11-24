const rest = require("./github/rest");
const graphql = require("./github/graphql");

module.exports = { ...rest, ...graphql };
