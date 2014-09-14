var utils = require('./utils');

module.exports = function (app, packages) {
	
	var mysql = packages.mysql;
	var moment = packages.moment;
	
	app.post('/sale/add', function (req, res) {

		// apply validations
		var sale = req.body.sale;
		
		var errors = {};
		if(utils.isEmpty(sale.type)) {
			errors.type = 'This is required.';
		}
		if(utils.isEmpty(sale.dealer)) {
			errors.dealer = 'Dealer should be selected from the options. Click on + button to add new dealer.';
		}
		if(utils.isEmpty(sale.invoice_no) || !utils.isNumeric(sale.invoice_no)) {
			//TODO also check for invoice no in database
			errors.invoice_no = 'Invoice no. is required and should be numeric.';
		}
		if(utils.isEmpty(sale.invoice_date) || !moment(sale.invoice_date).isValid()) {
			errors.invoice_date = 'Invoice date is required and should be DD-MM-YYYY.';
		}
		if(utils.isEmpty(sale.item_type)) {
			errors.item_type = 'Item type is required.';
		}
		if(utils.isEmpty(sale.item_quantity) || !utils.isNumeric(sale.item_quantity)) {
			errors.item_quantity = 'Item quantity is required and should be numeric.';
		}
		if(utils.isEmpty(sale.item_rate) || !utils.isNumeric(sale.item_rate)) {
			errors.item_rate = 'Item rate is required and should be numeric.';
		}
		if(utils.isEmpty(sale.vat_tax) || !utils.isNumeric(sale.vat_tax)) {
			errors.vat_tax = 'Vat tax is required and should be numeric.';
		}
		if(utils.isEmpty(sale.add_tax) || !utils.isNumeric(sale.add_tax)) {
			errors.add_tax = 'Add tax is required and should be numeric.';
		}
		if(utils.isEmpty(sale.invoice_amount) || !utils.isNumeric(sale.invoice_amount)) {
			errors.invoice_amount = 'Invoice amount is required and should be numeric.';
		}
		if(!utils.isEmpty(sale.credit_amount) && (!utils.isNumeric(sale.credit_amount) || sale.credit_amount > sale.invoice_amount)) {
			errors.credit_amount = 'Credit amount should be numeric and less than invoice amount.';
		}
		
		if(!utils.isEmpty(errors)) {
			res.json({
				done: false,
				error: 'There are some errors in the values submitted.',
				errors: errors
			});
		} else {
			var obj = {
				TYPE: sale.type,
				DEALER_ID: sale.dealer.ID,
				INVOICE_NO: sale.invoice_no,
				INVOICE_DATE: moment(sale.invoice_date).format('YYYY-MM-DD'),
				ITEM_TYPE: sale.item_type.ID,
				ITEM_QUANTITY: sale.item_quantity,
				ITEM_RATE: sale.item_rate,
				VAT_TAX: sale.vat_tax,
				ADD_TAX: sale.add_tax,
				INVOICE_AMOUNT: sale.invoice_amount,
				CREDIT_AMOUNT: sale.credit_amount || 0
			};
			
			if(sale.id) { // update operation
				mysql.query('UPDATE sales SET ? WHERE ID = ?', [obj, sale.id], function(err, result) {
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			} else { // add operation
				mysql.query('INSERT INTO sales SET ?', obj, function(err, result) {
					if(err) console.error(err);
					res.json({
						done: err ? false : true,
						error: JSON.stringify(err)
					});
				});
			}
			
		}
	});
	
	app.get('/sales', function(req, res) {
		console.log('Request for all sales');
		mysql.query("SELECT s.*, CONCAT(d.NAME,', ',d.CITY) as DEALER, g.NAME as ITEM FROM sales s LEFT JOIN dealers d "+
				"ON s.DEALER_ID = d.ID "+
				"LEFT JOIN goods g ON g.ID = s.ITEM_TYPE", function(err, result) {
			res.json({
				done: err ? false : true,
				error: JSON.stringify(err),
				response: result
			});
		});
	});
	
	app.get('/sale/:id', function(req, res) {
		var id = req.params.id;
		console.log('Request for sale:' + id);
		mysql.query("SELECT * FROM sales WHERE ID = ?", [id], function(err, result) {
			console.log(result);
			var sale = {};
			if(!result || result.length === 0) {
				err = 'No sale found for id '+id;
			} else {
				sale = {
					id: result[0].ID,
					type: result[0].TYPE,
					dealer: result[0].DEALER_ID,
					invoice_no: result[0].INVOICE_NO,
					invoice_date: moment(result[0].INVOICE_DATE).format('DD-MM-YYYY'),
					item_type: result[0].ITEM_TYPE,
					item_quantity: result[0].ITEM_QUANTITY,
					item_rate: result[0].ITEM_RATE,
					vat_tax: result[0].VAT_TAX,
					add_tax: result[0].ADD_TAX,
					invoice_amount: result[0].INVOICE_AMOUNT,
					credit_amount: result[0].CREDIT_AMOUNT
				};
			}
			res.json({
				done: err ? false : true,
				error: JSON.stringify(err),
				response: sale
			});
		});
	});
	
	app.post('/sale/delete/:id', function(req, res) {
		var id = req.params.id;
		console.log('Request to delete sale:' + id);
		if(!id) {
			res.json({
				done: false,
				error: 'Some error occured. Please try again.'
			});
		} else {
			mysql.query('DELETE FROM sales WHERE ID = ?', id, function(err, result) {
				console.log(result);
				res.json({
					done: err ? false : true,
					error: JSON.stringify(err),
					response: result
				});
			});
		}
	});
	
};