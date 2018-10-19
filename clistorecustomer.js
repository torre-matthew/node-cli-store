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
        displayInventory();                
    }

  });

//   This function will display all of the items available for sale.
    connection.query("select * from products", function(err, data) {   
        
             if (err) throw err;

            chooseItemToPurchase(data, passedtotal);   
        });
}

// Display inventory to user. Have them choose what they'll be purchasing. 
// In order to keep track of the users running total, I'm passing the passedtotal param from purchaseMore function. 
let chooseItemToPurchase = (data, passedtotal) => {
    let choiceArr = [];
    let inventoryList = (data) => {
// Looping through the inventory in db and pushing each item to an array that'll be used in the list inquirer prompt below.
        for (let i = 0; i < data.length; i++) {
            let item = data[i].product_name;
            choiceArr.push(item);   
        }
        return choiceArr;
    }

    inquirer.prompt([
        {
            name: "whatchuBuying",
            type: "list",
            message: "What kind of tea will you be having today?",
            choices: inventoryList(data)
        }
    ]).then(function(answers) {
        howMany(answers.whatchuBuying, passedtotal);
    });
}

// This fucntion asks the user if they'd like to add any more items to their order.
let purchaseMore = (currenttotal) => {
    let newtotal = 0;

    inquirer.prompt([
        {
            name: "purchaseMore",
            type: "confirm",
            message: "Would you like to add another item to your order?"
        }
    ]).then(function(answers) {
        if (answers.purchaseMore) {
// When a total is calculated from the howMany function, calculate a new total. 
// Increment by the amount calculated in the howMany function each time the user adds more items to their order.
            newtotal += currenttotal;
            displayInventory(newtotal);
        } else {
            completeOrder(currenttotal);
        }

    });
}

// Ask how many units of the product they would like to buy.
let howMany = (itemselected, passedtotal) => {
    
    inquirer.prompt([
        {
            name: "howMany",
            type: "input",
            message: "How many " + itemselected + "s you like?"
        }
    ]).then(function(answers) {
        let query = "SELECT * FROM products WHERE ?";
         
            connection.query(query, {product_name: itemselected}, function(err, res) {  
            
                if (err) throw err;
// Check that there's enough in inventory to fulfill this order.
// Make sure passedtotal has been calculated at least once or total calculated here will be NaN.
                else if ((res[0].quant_in_stock >= answers.howMany) && passedtotal != undefined) {
                    updateDB(itemselected, res[0].quant_in_stock, answers.howMany);
                    let total = calcTotal(res[0].price, answers.howMany) + passedtotal; 
                    console.log('');
                    console.log("Your order total thus far is: " + "$" + total);
                    console.log('');
                    purchaseMore(total);
                }
// For the first item(s) added, don't included the passedtotal param as that value only gets calculated on subsequent items being added to the order.
                else if ((res[0].quant_in_stock >= answers.howMany) && passedtotal == undefined) {
                    updateDB(itemselected, res[0].quant_in_stock, answers.howMany);
                    let total = calcTotal(res[0].price, answers.howMany); 
                    console.log('');
                    console.log("Your order total thus far is: " + "$" + total);
                    console.log('');
                    purchaseMore(total);
                }
//Not enough inventory to process order, tell the user and have them either update their order or leave
                else {
                    console.log('');
                    console.log("Sorry, we don't have enough inventory to fulfill that order.");
                    console.log('');
                    purchaseMore(total);
                }
            })
        })    
}

// Once the update goes through, show the customer the total cost of their purchase.
let completeOrder = (currenttotal) => {
    console.log('');
    console.log("*                                                                               *");
    console.log("");
    console.log("   This sweet and refreshing order is going to cost you " + "$" + currenttotal + ". Pay me Sucka!!!");
    console.log("");
    console.log("*                                                                               *");
    connection.end();
}

//Updating the SQL database to reflect the remaining quantity.
let updateDB = (item, current_db_quant, amount_to_purchase) => {
    let query = "UPDATE products SET ? WHERE ?";
    let newQuant = current_db_quant - amount_to_purchase;

        connection.query(query, [{quant_in_stock: newQuant}, {product_name: item}], function(err, res) {  

            if (err) throw err;

            return newQuant;
        });
}

// Tiny function to calculate an initial total.
let calcTotal = (price, quantity) => {
    let total = price*quantity;
    return total;
}


// To Do:
// Bug: if total isn't calculated and inventory is too low to cover an order, the app shits the bed
// 