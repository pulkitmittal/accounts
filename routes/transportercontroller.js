var utils = require('./utils');

module.exports = function (app, packages) {
	
	var mysql = packages.mysql;

	app.post('/transporter/add', function (req, res) {

		// apply validations
		var transporter = req.body.transporter;
		var errors = {};
		if(utils.isEmpty(transporter.name)) {
			errors.name = 'This is required.';
		}
		if(utils.isEmpty(transporter.city)) {
			errors.city = 'This is required.';
		}
		if(utils.isEmpty(transporter.state)) {
			errors.state = 'This is required.';
		}
		
		if(!utils.isEmpty(errors)) {
			res.json({
				done: false,
				error: 'There are some errors in the values submitted.',
				errors: errors
			});
		} else {
			var obj = {
				'NAME': transporter.name,
				'ADDRESS': transporter.address,
				'CITY': transporter.city,
				'STATE': transporter.state
			};
			
			if(transporter.id) { // update operation
				mysql.query('UPDATE transporters SET ? WHERE ID = ?', [obj, transporter.id], function(err, result) {
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			} else { // add operation
				mysql.query('INSERT INTO transporters SET ?', obj, function(err, result) {
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			}
		}
	});
	
	app.post('/transporter/delete/:id', function(req, res) {
		var id = req.params.id;
		console.log('Request to delete transporter:' + id);
		if(!id) {
			res.json({
				done: false,
				error: 'Some error occured. Please try again.'
			});
		} else {
			mysql.query('DELETE FROM transporters WHERE ID = ?', id, function(err, result) {
				console.log(result);
				res.json({
					done: err ? false : true,
					error: JSON.stringify(err),
					response: result
				});
			});
		}
	});
	
	app.get('/transporters', function(req, res) {
		console.log('Request for all transporters');
		mysql.query('SELECT * FROM transporters', function(err, result) {
			console.log(result);
			res.json({
				done: err ? false : true,
				error: JSON.stringify(err),
				response: result
			});
		});
	});
	
	app.get('/transporter/:id', function(req, res) {
		var id = req.params.id;
		console.log('Request for transporter:' + id);
		mysql.query('SELECT * FROM transporters WHERE id = ?', [id], function(err, result) {
			console.log(result);
			var transporter = {};
			if(!result || result.length === 0) {
				err = 'No transporter found for id '+id;
			} else {
				transporter = {
					id: result[0].ID,
					name: result[0].NAME,
					address: result[0].ADDRESS,
					city: result[0].CITY,
					state: result[0].STATE
				};
			}
			res.json({
				done: err ? false : true,
				error: JSON.stringify(err),
				response: transporter
			});
		});
	});
};