module.exports = function (app, mysql) {

	app.post('/dealer/add', function (req, res) {

		// apply validations
		var dealer = req.body.dealer;
		var errors = {};
		if(isEmpty(dealer.name)) {
			errors.name = 'This is required.';
		}
		if(isEmpty(dealer.city)) {
			errors.city = 'This is required.';
		}
		if(isEmpty(dealer.state)) {
			errors.state = 'This is required.';
		}
		if(!isTINValid(dealer.tin)) {
			errors.tin = 'TIN should be 10 digits.';
		}
		
		if(!isEmpty(errors)) {
			res.json({
				done: false,
				error: 'There are some errors in the values submitted.',
				errors: errors
			});
		} else {
			var dealerObj = {
				'NAME': dealer.name,
				'ADDRESS': dealer.address,
				'CITY': dealer.city,
				'STATE': dealer.state,
				'TIN': dealer.tin
			};
			
			if(dealer.id) { // update operation
				var query = mysql.query('UPDATE dealers SET ? WHERE ID = ?', [dealerObj, dealer.id], function(err, result) {
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			} else { // add operation
				var query = mysql.query('INSERT INTO dealers SET ?', dealerObj, function(err, result) {
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			}
		}
	});
	
	app.post('/dealer/delete/:id', function(req, res) {
		var id = req.params.id;
		console.log('Request to delete dealer:' + id);
		if(!id) {
			res.json({
				done: false,
				error: 'Some error occured. Please try again.'
			});
		} else {
			var query = mysql.query('DELETE FROM dealers WHERE ID = ?', id, function(err, result) {
				console.log(result);
				res.json({
					done: err ? false : true,
					error: JSON.stringify(err),
					response: result
				});
			});
		}
	});
	
	app.get('/dealers', function(req, res) {
		console.log('Request for all dealers');
		var query = mysql.query('SELECT * FROM dealers', function(err, result) {
			console.log(result);
			res.json({
				done: err ? false : true,
				error: JSON.stringify(err),
				response: result
			});
		});
	});
	
	app.get('/dealer/:id', function(req, res) {
		var id = req.params.id;
		console.log('Request for dealer:' + id);
		var query = mysql.query('SELECT * FROM dealers WHERE id = ?', [id], function(err, result) {
			console.log(result);
			var dealer = {};
			if(!result || result.length == 0) {
				err = 'No dealer found for id '+id;
			} else {
				dealer = {
					id: result[0].ID,
					name: result[0].NAME,
					address: result[0].ADDRESS,
					city: result[0].CITY,
					state: result[0].STATE,
					tin: result[0].TIN
				};
			}
			res.json({
				done: err ? false : true,
				error: JSON.stringify(err),
				response: dealer
			});
		});
	});

};

var isEmpty = function(obj) {
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

var isTINValid = function(tin) {
	var reg_ex = /^\d{10}$/;
	return isEmpty(tin) || (!isNaN(parseInt(tin)) && reg_ex.test(parseInt(tin)));
};