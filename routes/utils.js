var utils = {};

utils.isEmpty = function(obj) {
	obj = obj || '';
	if(typeof obj === "string") {
		return obj === '' || obj.length === 0;
	}
	else if(typeof obj === "object") {
		if(obj.length) { // array
			return obj.length === 0;
		}
		else {
			return Object.keys(obj).length === 0;
		}
	}
};

utils.isTINValid = function(tin) {
	var reg_ex = /^\d{10}$/;
	return utils.isEmpty(tin) || (!isNaN(parseInt(tin,10)) && reg_ex.test(parseInt(tin,10)));
};

module.exports = utils;