var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection ({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'Bamazon'
});

connection.connect(function(err) {
    if(err) throw err;
});

connection.query('SELECT * FROM Products WHERE StockQuantity > 0', function(error, results) {
    console.log('item ID | product | price');
    for (var i = 0; i < results.length; i++) {
        var currentRow = results[i];
        console.log(currentRow.ItemID + ' | ' + currentRow.ProductName + ' | ' + currentRow.Price.toFixed(2));
    }
    inquirer.prompt([{
        name: 'ID',
        message: 'Please enter the item ID of the product you would like to buy.'
    }, {
        name: 'quantity',
        message: 'How many would you like to buy?'
    }]).then(function(answers) {
        var itemRow;
        var i = 0;
        do {
            itemRow = results[i]
            i++;
        } while (itemRow.ItemID != answers.ID && i < results.length);
        if (answers.quantity > itemRow.StockQuantity) {
            console.log('Insufficient quantity!');

        } else {
            connection.query('UPDATE Products SET ? WHERE ?', [{
                StockQuantity : (itemRow.StockQuantity - answers.quantity)
            }, {
                ItemID : answers.ID
            }], function(err,res) {
                if(err) throw err;
                var transactionTotal = answers.quantity * itemRow.Price;
                console.log('Total cost: $' + transactionTotal);
                connection.query('UPDATE Departments SET TotalSales = TotalSales + ? WHERE ?', [
                    transactionTotal,
                    {
                        DepartmentName : itemRow.DepartmentName
                }], function(err,res){
                        if(err) throw err;
                });

            });
        }
    });
});

