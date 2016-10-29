var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

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

function displaySalesByDepartment() {
    var table = new Table({
        head: ['ID', 'DepartmentName', 'OverHeadCosts', 'ProductSales', 'TotalProfit'],
        colWidths: [5, 20, 15, 15, 15]
    });
    connection.query('SELECT * FROM Departments', function(err,departmentsData) {
        if(err) throw err;
        for (var i = 0; i < departmentsData.length; i++) {
            var currentDepartment = departmentsData[i];
            var TotalProfit = currentDepartment.TotalSales - currentDepartment.OverHeadCosts;
            table.push([currentDepartment.DepartmentID, currentDepartment.DepartmentName, currentDepartment.OverHeadCosts.toFixed(2), currentDepartment.TotalSales.toFixed(2), TotalProfit.toFixed(2)]);
        }
        console.log(table.toString());
    });
}

function createNewDepartment () {
    inquirer.prompt ([{
        name: 'DepartmentName',
        message: 'department name: '
    }, {
        name: 'OverHeadCosts',
        message: 'overhead costs: '
    }]).then(function(answers) {
        var newRow = {
            DepartmentName: answers.DepartmentName,
            OverHeadCosts: answers.OverHeadCosts,
            TotalSales: 0
        };
        connection.query('INSERT INTO Departments SET ?', newRow, function(err,res){});
    });
}

inquirer.prompt({
    name: 'task',
    message: 'What would you like to do?',
    type: 'list',
    choices: ['view product sales by department', 'create new department']
}).then(function(answer) {
    if (answer.task == 'view product sales by department') {
        displaySalesByDepartment();
    } else {
        createNewDepartment();

    }
});