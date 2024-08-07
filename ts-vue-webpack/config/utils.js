const path = require("path");

module.exports = {
	resolveApp: (p) => path.resolve(__dirname, "../" + p),
};