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
                "Add New Product",
                "End Session"
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
				chooseItem();	
				console.log('');
                break;
                
            case "Add New Product":
				newItemName();	
                break;
                
            case "End Session":
				connection.end();	
				break;
			
			default:
				break;
		}
        
    });
}


let viewProductsForSale = () => {
    connection.query("select * from products", function(err, data) {   
        
        if (err) throw err;
		
        console.table(data, ["product_name", "item_id", "price", "quant_in_stock"]);
        console.log('');
        managerOptions();
   });

}

let viewLowInventory = ()  => {
	let query = "select * from products where quant_in_stock < 5";
	connection.query(query, function(err, data) {   
        
        if (err) throw err;
        
        else if (data.length === 0) {
            console.log('');
            console.log("Stock is looking good. All items have more than 5 Units avalable.");
            console.log('');
            managerOptions();
        }

        else {
            console.table(data, ["product_name", "item_id", "price", "quant_in_stock"]);
            console.log('');
            managerOptions();
        }
   });
    
}

let addToInventory = (item, amounttoadd)  => {
	let realItem = parseInt(item);
	let query = "select * from products where item_id = " + realItem;
	
	connection.query(query, function(err, queryData) {   
        
		if (err) throw err;
            
        let newAmount = parseInt(queryData[0].quant_in_stock) + parseInt(amounttoadd);
    
		let updateQuery = "update products set ? where ?";
		
				connection.query(updateQuery, [{quant_in_stock: newAmount},{item_id: realItem}], function(err, updateData) {   
				
					if (err) throw err;
                    console.log('');
                    console.log('');
                    console.log("You've successfully updated the following:");
                    console.log('');
                    displayUpdatedItem(item);
				});
	});	

}

let displayUpdatedItem = (itemId) => {
    let selectQuery = "select * from products where item_id = " + itemId;
		
				connection.query(selectQuery, function(err, selectData) {   
				
					if (err) throw err;
					
                    console.table(selectData);
                    console.log('');
                    managerOptions();
				});
}

let chooseItem = () => {
	inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Choose the item, by item_id, that you'd like to add more to.",
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

let newItemName = () => {

    inquirer.prompt([
        {
            name: "itemName",
            type: "input",
            message: "Enter item Name",
        }
    ]).then(function(answers) { 
            newItemDep(answers.itemName);
        
    });
}

let newItemDep = (name) => {

    inquirer.prompt([
        {
            name: "itemDep",
            type: "list",
            message: "What Department?",
            choices: ["Fruit Tea", "Milk Tea"]
        }
    ]).then(function(answers) { 
            newItemPrice(name, answers.itemDep);
        
    });
}

let newItemPrice = (name, dep) => {

    inquirer.prompt([
        {
            name: "itemPrice",
            type: "input",
            message: "What's the price of this item? $",
        }
    ]).then(function(answers) { 
            newItemQuant(name, dep, answers.itemPrice);
        
    });
}

let newItemQuant = (name, dep, price) => {

    inquirer.prompt([
        {
            name: "itemQuant",
            type: "input",
            message: "How Many Units?",
        }
    ]).then(function(answers) { 
            addNewProduct(name, dep, price, answers.itemQuant)
            
        
    });
}

let addNewProduct = (name, dep, price, quant)  => {
    
    
        
        let insertQuery = "insert into products (product_name, dep, price, quant_in_stock ) values ?";
        let values = [[name, dep, price, quant]];
    
        connection.query(insertQuery, [values], function(err, queryData) {   
            
            if (name.split(" ").length >= 1) {
                console.log('');
                console.log("You've successfully added " + quant + " units of " + name + " at $" + price + " each");
                console.log('');
                managerOptions();
            }
            else if (err) {
                throw err;
            }     
        });
    
}

let displayAddedItem = (name) => {
   
    
   
        let selectQuery = "select * from products where product_name = " + name;
        connection.query(selectQuery, function(err, queryData) {   
                
                    if (err) throw err;
                    
                    console.log('');
                    console.log("You've successfully added the following:");
                    console.table(queryData);
                    console.log('');
                
        });
    
}   