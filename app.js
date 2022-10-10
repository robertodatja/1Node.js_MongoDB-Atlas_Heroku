const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");//1) Connect our project with mongoose
const configss = require("./Configs");//SECURE
const app = express();

//CONNECT to MongoDB Atlas
//mongoose.connect("mongodb://localhost:27017/todolistDB") //2) Create a new database called todolistDB
//COPY-PASTE FROM Atlas Cluster-Connect your application, set pswd, delete this part ?retryWrites=true&w=majority/
mongoose.connect("mongodb+srv://admin-"+configss.name+":"+configss.pswd+"@atlascluster.qs6ael0.mongodb.net/todolistDB");

const itemsSchema = { name: String }; //3) Create a new schemma called itemsSchema
const Item = mongoose.model("Item", itemsSchema); //4) Create a new mongoose model called Item

//6) Let's create 3 new documents|items
const item1 = new Item( {name: "Welcome to your todolist"} );
const item2 = new Item( {name: "Hit the button + to add a new item"} );
const item3 = new Item( {name: "<-- Hit this to delete a item"} );

//7) Put them all into an array called defaultItems
const defaultItems = [item1, item2, item3];

//17.3)
const listSchema = { name: String, items: [itemsSchema] }; //Create a new schemma called listSchema
const List = mongoose.model("List", listSchema); //Create a new mongoose model called List

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
/*3-----------------------------Add CSS to Website-----------------------------*/
app.use(express.static("public"));

/*1-------------------------------app.get()------------------------------------*/
app.get("/", function(req, res) {

 Item.find({}, function(err, foundItems) { //9) find all items  i.e return an array
  //console.log(foundItems); //9) then log them  //13).3
  if (foundItems.length === 0) { //13.4)
   Item.insertMany(defaultItems, function(err) { //8) Insert them into Item collection in our database
    if (err) {
     console.log(err);
    } else {
     console.log("Successfully saved defaultItems into DB");
    }
   });
   res.redirect("/"); //14)
  } else {
   res.render("list", {
    listTitle: "Today", //5) Put a string  called "Today" as value of listTitle key
    newListItems: foundItems //10)
   });
  }
 });
});


/*2-------------------------------app.post()------------------------------------*/
app.post("/", function(req, res) {
 const itemName = req.body.newItem; /*6--- we got it from list.ejs*/
 const listName = req.body.list; /*18)--- we got it from list.ejs*/

 //15)
 const item = new Item( {name: itemName} ); //Create a new item document based of my model in MongoDB

 // 19)
 /*No matter which list we're in when a user tries to add an input into the text field and then press the submit button,
 the form will make a post request that's handled through the root route  <form class="item" action="/" method="post"> and our server will catch it app.post("/", ...)
 And then,  we will check to see if the list that the user tried to add the item into was from:
 1: the defaultlist where the listName is equal to today in which case we're just going to do a simple save item redirect back to the root route.
 2: a custom list, then we're going to find that custom list and then we're going to add this new item to the items in that list.
 Then redirect back to the /listName which should take us into app.get("/",  ... and then we can render all of the items that belong in that list )
 */

 if (listName === "Today") {
  //Our newItem comes from dafaultList|Today
  item.save(); //save item into Item collection. Also we can use insert methods
  res.redirect("/"); //redirect to our home routeitem.save();
 }else{
  //Our newItem comes from a customList
  List.findOne( {name: listName}, function(err,foundList){ //find for listName list into List collection
   foundList.items.push(item); //add item into array of items in foundList
   foundList.save();
   res.redirect("/"+listName); //go to app.get("/:listName",...)
  });
 }

});


//16)
app.post("/delete", function(req, res) {
 const checkedItemId = req.body.checkBOX; //value of the checkbox
  const listName = req.body.listNAME; //value of the listNAME 20.2)
 Item.findByIdAndRemove(checkedItemId, function(err) {
  if (!err) {
   console.log("Successfully deleted checked item!");
   res.redirect("/"); //redirect to our home route
  }
 })
});

/*4-------------------------------Templating------------------------------------*/
//17.1)
app.get("/:customListName", function(req, res) {
 const customListName = req.params.customListName; //Name of New List //17.2)

//17.5)
/*So as a challenge, I want you to use the Mongoose method called findOne to find within our lists collection
whether if there's a list that has the same name as the one that the user is currently trying to access.*/
 List.findOne( {name: customListName}, function(err,foundList){  //findOne i.e return an object|document
  if (!err) {
   if(!foundList){
    //console.log("Doesn't exist!");
    //Create a new list //17.4)
    const list = new List( { name: customListName, items: defaultItems });
    list.save(); //save it intto List collection in todolistDB //17.4)
    res.redirect("/"+customListName); //17.6)
   }else{
    //17.5)
    //console.log("Exist!");
    //Show an existing list
    res.render("list", {
     listTitle: foundList.name,
     newListItems: foundList.items
    });
   }
  }
 });

});



/*4-------------------------------Templating------------------------------------*/
app.get("/about", function(req, res) {
 res.render("about");
});


/*0-------------------------------localhost or Heroku---------------------------*/
let port = process.env.PORT;
if (port == null || port == "") {
 port = 3000;
}

app.listen(port, function() {
 console.log("The server is runnning in port 3000");
});
