var utils = require('./utils');

module.exports = function (app, mysql) {
	
	app.post('/sale/add', function (req, res) {

		// apply validations
		var sale = req.body.sale;
		
		console.log(sale);
		res.json({
			done: false,
			error: 'In progress'
		});
		/*var dealer = req.body.dealer;
		var errors = {};
		if(utils.isEmpty(dealer.name)) {
			errors.name = 'This is required.';
		}
		if(utils.isEmpty(dealer.city)) {
			errors.city = 'This is required.';
		}
		if(utils.isEmpty(dealer.state)) {
			errors.state = 'This is required.';
		}
		if(!utils.isTINValid(dealer.tin)) {
			errors.tin = 'TIN should be 10 digits.';
		}
		
		if(!utils.isEmpty(errors)) {
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
				mysql.query('UPDATE dealers SET ? WHERE ID = ?', [dealerObj, dealer.id], function(err, result) {
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			} else { // add operation
				mysql.query('INSERT INTO dealers SET ?', dealerObj, function(err, result) {
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			}
		}*/
	});
	
	/*app.post('/dealer/delete/:id', function(req, res) {
		var id = req.params.id;
		console.log('Request to delete dealer:' + id);
		if(!id) {
			res.json({
				done: false,
				error: 'Some error occured. Please try again.'
			});
		} else {
			mysql.query('DELETE FROM dealers WHERE ID = ?', id, function(err, result) {
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
		mysql.query('SELECT * FROM dealers', function(err, result) {
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
		mysql.query('SELECT * FROM dealers WHERE id = ?', [id], function(err, result) {
			console.log(result);
			var dealer = {};
			if(!result || result.length === 0) {
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
	});*/
};