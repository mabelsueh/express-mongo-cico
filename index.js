// EXPRESS AND OTHER SETUP
const express = require('express');
// need ./ to show 
const MongoUtil = require('./MongoUtil.js')
const hbs = require('hbs')
const wax = require('wax-on')
// inject into the environment (the OS) our environmental variables
require('dotenv').config();

// load in environment variables
require('dotenv').config();

// create the app
const app = express();
// use handlebars as the view enging (for templates) - not the onlu option
app.set('view engine', 'hbs')
// for static files (img/css etc) to be in a folder named public
app.use(express.static('public'))
// for form enabling
app.use(express.urlencoded({extended:false}))

// setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    // tgc9-cico is our new db to be created (previously did not exist)
    await MongoUtil.connect(MONGO_URL, "tgc9-cico");
    let db = MongoUtil.getDB();

    app.get('/', async(req,res)=>{
        let food = await db.connection(food).find().toArray();
        res.render('food', {
            'foodRecords':food
        })
    })
    // display form for user to add food consumed
    app.get('food/add', async (req,res)=>{
        res.render('add_food');
    })

    app.post('food/add', async(res,req)=>{
        // for testing only - res.render()
        // use object destructuring to extract each of the input from the form
        let {name, calories, meal, date, tags} = req.body;
        // this is the shortcut for the let name = req.body.name etc

        let newFoodRecord = {
            'name': name,
            'calories': parseFloat(calories),
            'meal':meal,
            'date':new Date(date),
            'tags':tags
        }

        await db.collection('food').insertOne(newFoodRecord);
        res.redirect('/')
    })
}


// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
    
})