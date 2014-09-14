var utils = require('./utils');

module.exports = function (app, packages) {
	
	var mysql = packages.mysql;

	app.post('/manufacturer/add', function (req, res) {

		// apply validations
		var manufacturer = req.body.manufacturer;
		var errors = {};
		if(utils.isEmpty(manufacturer.name)) {
			errors.name = 'This is required.';
		}
		if(utils.isEmpty(manufacturer.city)) {
			errors.city = 'This is required.';
		}
		if(utils.isEmpty(manufacturer.state)) {
			errors.state = 'This is required.';
		}
		if(!utils.isTINValid(manufacturer.tin)) {
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
				'NAME': manufacturer.name,
				'ADDRESS': manufacturer.address,
				'CITY': manufacturer.city,
				'STATE': manufacturer.state,
				'TIN': manufacturer.tin
			};
			
			if(manufacturer.id) { // update operation
				mysql.query('UPDATE manufacturers SET ? WHERE ID = ?', [dealerObj, manufacturer.id], function(err, result) {
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			} else { // add operation
				mysql.query('INSERT INTO manufacturers SET ?', dealerObj, function(err, result) {
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			}
		}
	});
	
	app.post('/manufacturer/delete/:id', function(req, res) {
		var id = req.params.id;
		console.log('Request to delete manufacturer:' + id);
		if(!id) {
			res.json({
				done: false,
				error: 'Some error occured. Please try again.'
			});
		} else {
			mysql.query('DELETE FROM manufacturers WHERE ID = ?', id, function(err, result) {
				console.log(result);
				res.json({
					done: err ? false : true,
					error: JSON.stringify(err),
					response: result
				});
			});
		}
	});
	
	app.get('/manufacturers', function(req, res) {
		console.log('Request for all manufacturers');
		mysql.query('SELECT * FROM manufacturers', function(err, result) {
			console.log(result);
			res.json({
				done: err ? false : true,
				error: JSON.stringify(err),
				response: result
			});
		});
	});
	
	app.get('/manufacturer/:id', function(req, res) {
		var id = req.params.id;
		console.log('Request for manufacturer:' + id);
		mysql.query('SELECT * FROM manufacturers WHERE id = ?', [id], function(err, result) {
			console.log(result);
			var manufacturer = {};
			if(!result || result.length === 0) {
				err = 'No manufacturer found for id '+id;
			} else {
				manufacturer = {
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
				response: manufacturer
			});
		});
	});
};