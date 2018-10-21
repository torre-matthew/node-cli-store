let mysql = require("mysql");
let inquirer = require("inquirer");
let dbpass = require("./dbpass.js");

let connection = mysql.createConnection({
    host: "localhost",

    port: 3306,
  
    user: "root",
  
    password: dbpass,
    database: "clistore_db"
  });

connection.connect(function(err) {
    if (err) {
        throw err;
    }else {
        managerOptions();                
    }

  });

let managerOptions = ()  => {
    inquirer.prompt([
        {
            name: "managertask",
            type: "list",
            message: "What would you like to to do today?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }
    ]).then(function(answers) {

		switch (answers.managertask) {
			case "View Products for Sale":
				viewProductsForSale();	
				break;

			case "View Low Inventory":
				viewLowInventory();	
				break;
			
			case "Add to Inventory":
				viewProductsForSale();
				console.log('');
				chooseItem();	
				console.log('');
				break;
			
			default:
				break;
		}
        
    });
}


let viewProductsForSale = () => {
    connection.query("select * from products", function(err, data) {   
        
        if (err) throw err;
		
        console.table(data, ["product_name", "price", "quant_in_stock"]);
        console.log('');
   });

}

let viewLowInventory = ()  => {
	let query = "select * from products where quant_in_stock < 5";
	connection.query(query, function(err, data) {   
        
        if (err) throw err;
        
        else if (data.length === 0) {
            console.log('');
            console.log("Stock is looking good. All items have more than 5 Units avalable.");
        }

        else {
            console.table(data, ["product_name", "price", "quant_in_stock"]);
		console.log('');
        }
   });
    
}

let addToInventory = (item, amounttoadd)  => {
	let realItem = parseInt(item) + 1;
	let query = "select * from products where item_id = " + realItem;
	
	connection.query(query, function(err, queryData) {   
        
		if (err) throw err;
            
        let newAmount = parseInt(queryData[0].quant_in_stock) + parseInt(amounttoadd);
    
		let updateQuery = "update products set ? where ?";
		
				connection.query(updateQuery, [{quant_in_stock: newAmount},{item_id: realItem}], function(err, updateData) {   
				
					if (err) throw err;
					
					console.log(queryData);
				});
	});	

}

let chooseItem = () => {
	inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Choose the item, by index, that you'd like to add more to.",
        }
    ]).then(function(answers) { 
			
			chooseAmountToAdd(answers.item);
    });
}

let chooseAmountToAdd = (item) => {	
	inquirer.prompt([
        {
            name: "amountToAdd",
            type: "input",
            message: "How many units will you be adding?",
        }
    ]).then(function(answers) { 
			addToInventory(item, answers.amountToAdd);
    });
}


let addNewProduct = ()  => {
    
}