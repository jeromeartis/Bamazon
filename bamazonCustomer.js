const mysql = require('mysql');
const inquirer = require('inquirer');
let getItemID = "";
let showQuantity = "";
let orderItem = "";
let currentPrice = "";
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon',
});

connection.query('SELECT * FROM products', (err, rows) => {
  if (err) throw err;

  //console.log('Data received from Db:\n');
  console.log(rows);
  start();
});



const start = function() {

  inquirer
    .prompt([
      {
      name: 'username',
      type: 'input',
      message: 'Enter Customer Name',
      // choice: ["Item ID","Quantity"],
    }, ]).then(function(answer) {
      if (answer.username) {
        console.log(`Welcome ${answer.username} to Bamzon`)
        getItem();
      }
      else {
        console.log(`Customer Name not Entered`)
        getItem();
      }
    })
}

const getItem = function (){
  inquirer
  .prompt([
    {
      name:'itemID',
      type: 'input',
      messge: 'Enter Item ID',
  },
]).then(function (answer){
   getItemID = answer.itemID

  // console.log(`Stored Item : ${getItemID}`);
  connection.query("SELECT * FROM products WHERE ?",
    [{
      item_id: getItemID
    }],
    function(err, res) {

      for(let i = 0; i < res.length; i++){
        let getQuantity = res[i].stock_quantity
      // console.log(`Product Name ${res[i].product_name}`)
      console.log(`Item Quantity: ${res[i].stock_quantity}`)
      currentPrice = res[i].price
      showQuantity = res[i].stock_quantity
      // console.log(`adkjalkfjadkljdfalkaj: ${res[i].stock_quantity}`);
      getQ();
    }
    });
  })
}

const getQ = function (){

  inquirer
  .prompt([
    {
      name: 'amountOrdered',
      type: 'input',
      message: 'How many units would you like to purchase?',
    },
  ]).then(function (answer){

    if (showQuantity >= answer.amountOrdered ){
      console.log("Order complete")
      orderItem = answer.amountOrdered
      console.log(`Amount Ordered 1: ${orderItem}`)
      updateQuantity();
      getItem();
    }else{
      console.log("Insufficient quantity!")
      getItem();
    }
  })
}
const updateQuantity = ()=> {
try {
// console.log(`Item ID: ${getItemID}`)
// console.log(`Current Quantity: ${showQuantity}`);
let updatedQuantity = showQuantity - orderItem
console.log("********************************************************")
console.log(`Current Items Available: ${updatedQuantity}`)
console.log(`Cost: ${currentPrice}`);
let totalPrice = orderItem * currentPrice
console.log(`Billed Amount: ${totalPrice}`);
console.log("********************************************************")
connection.query("UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?",
[ updateQuantity, getItemID]
)
}
catch(err){

}
// let totalCost = currentPrice * showQuantity

}
