# Boba Me, Baby!!
#### Node CLI E-commerce Store for Purchasing Milk and Fruit Bubble Tea

Running completely from the command line, this Node app will allow a user to select from a list of products in inventory.

#### Customer Experience

The customer experience calculates totals as multiple orders are place as well as reduces inventory amounts stored in the mysql datase when items are purchased. 

If inventory is too low to fulfill a particular request, the app will let the customer know and ask them to update their order. 

[Customer Experience Example Here](https://drive.google.com/file/d/1FmRsM0IeedUIYxfzHMzzw4KxHZYW828q/view)

#### Manager Experience 

Managers are able to perform the following task from the command-line.
* View all inventory
* View inventory running out
* Add units to inventory
* Add new products for sale

Read actions queries the mysql database and uses javascript console.table() to present all items in the mysql db to the user in a nicely formatted table.

Write actions updates data is the main sql table being used for this app. 

[Manager Experience Example Here](https://drive.google.com/file/d/1gMwsao8laKuk-i1UtXTkykl45DMku-4D/view)
 

### Technologies Used
[]() | []() | []()
------------------ | -------------------- | --------------------
[MySql](https://www.npmjs.com/package/mysql#connection-options) | [Inquirer](https://github.com/SBoudrias/Inquirer.js) |


Known Bug:
* In the customer experience, when user selects an amount that is greater than what's in stock, the app breaks. Calculated total to that point is lost and total not calculated moving forward.

