let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",

    port: 3306,
  
    user: "root",
  
    password: "Loveless27**",
    database: "clistore_db"
  });

connection.connect(function(err) {
    if (err) {
        throw err;
    }else {
        displayInventory();                
    }

  });

//   This function will display all of the items available for sale. Names, and prices of products for sale.
let displayInventory = () => {
    connection.query("select * from products", function(err, data) {   
        
             if (err) throw err;

            chooseItemToPurchase(data);   
        });
}

let chooseItemToPurchase = (data) => {
    let choiceArr = [];
    let inventoryList = (data) => {
        
        for (let i = 0; i < data.length; i++) {
            let item = data[i].product_name + " $" + data[i].price;
            choiceArr.push(item);    
        }
        return choiceArr;
    }

    inquirer.prompt([
        {
            name: "whatchuBuying",
            type: "list",
            message: "What are you drinking today?",
            choices: inventoryList(data)
        }
    ]).then(function(answers) {
        howMany();
        return answers.whatchuBuying;
    });
}

let purchaseMore = () => {
    
    inquirer.prompt([
        {
            name: "purchaseMore",
            type: "confirm",
            message: "Would you like to add another item to your order?"
        }
    ]).then(function(answers) {
        if (answers.purchaseMore) {
            displayInventory();
        } else {
            completeOrder();
        }
        return answers.purchaseMore;

    });
}

let howMany = () => {
    
    inquirer.prompt([
        {
            name: "howMany",
            type: "input",
            message: "How many would you like?"
        }
    ]).then(function(answers) {
        purchaseMore();
        return answers.howMany;

    });
}

let completeOrder = () => {
    console.log("You owe me money, muthafucka!!!");
    connection.end();
}





//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
