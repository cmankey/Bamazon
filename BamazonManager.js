var inquirer = require('inquirer');
var mysql = require('mysql');

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

function viewProductsForSale () {
    connection.query('SELECT ItemID, ProductName, Price, StockQuantity FROM Products', function(error, results) {
        console.log('item ID | product | price | stock quantity');
        for (var i = 0; i < results.length; i++) {
            var currentRow = results[i];
            console.log(currentRow.ItemID + ' | ' + currentRow.ProductName + ' | ' + currentRow.Price + ' | ' + currentRow.StockQuantity);
        }
    });
}

function viewLowInventory () {
    connection.query('SELECT ItemID, ProductName, Price, StockQuantity FROM Products WHERE StockQuantity < 5', function(error, results) {
        console.log('item ID | product | price | stock quantity');
        for (var i = 0; i < results.length; i++) {
            var currentRow = results[i];
            console.log(currentRow.ItemID + ' | ' + currentRow.ProductName + ' | ' + currentRow.Price + ' | ' + currentRow.StockQuantity);
        }
    });
}

function addInventory () {
    inquirer.prompt([{
        name: 'ID',
        message: 'Enter the item ID of the product you want to add.'
    },{
        name: 'number',
        message: 'Enter the number to be added.' 
    }]).then(function(res) {
        var ID = parseInt(res.ID);
        var query = connection.query('UPDATE Products SET StockQuantity = StockQuantity + ? WHERE ?', [ 
        parseInt(res.number),
        {
            ItemID: ID
        }], function(err,results){
            if(err) throw err;
        });
    });
}

function addNewProduct () {
    inquirer.prompt ([{
        name: 'ProductName',
        message: 'product name: '
    }, {
        name: 'Price',
        message: 'price: '
    }, {
        name: 'DepartmentName',
        message: 'department: '
    }, {
        name: 'StockQuantity',
        message: 'number in stock: '
    }]).then(function(answers) {
        var newRow = {
            ProductName: answers.ProductName,
            Price: answers.Price,
            DepartmentName: answers.DepartmentName,
            StockQuantity: answers.StockQuantity
        };
        connection.query('INSERT INTO Products SET ?', newRow, function(err,res){});
    });
}

inquirer.prompt({
    name: 'task',
    message: 'What would you like to do?',
    type: 'list',
    choices: ['view products for sale', 'view low inventory', 'add to inventory', 'add new product']
}).then(function(res) {
    switch (res.task) {
        case 'view products for sale':
            viewProductsForSale();
            break;
        case 'view low inventory':
            viewLowInventory();
            break;
        case 'add to inventory':
            console.log('add inventory');
            addInventory();
            break;
        case 'add new product':
            console.log('add product');
            addNewProduct();
            break;
        default:
            break;
    }
});