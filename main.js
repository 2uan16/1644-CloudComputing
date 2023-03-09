var express = require('express');
const async = require('hbs/lib/async')
const mongo = require('mongodb');
const { ObjectId } = require('mongodb')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://GCH200087:gch200087@cluster0.tkcln.mongodb.net/?retryWrites=true&w=majority'
//var url = 'mongodb://leduchuy2207:leduchuy2002@ac-uijn7xw-shard-00-00.q7dpd26.mongodb.net:27017,ac-uijn7xw-shard-00-01.q7dpd26.mongodb.net:27017,ac-uijn7xw-shard-00-02.q7dpd26.mongodb.net:27017/test?replicaSet=atlas-hoj30z-shard-0&ssl=true&authSource=admin'

const PORT = process.env.PORT || 7000
app.listen(PORT)
console.log("Server is running at " + PORT)
//////////////////////////////////////////////////////////////////////////////////////////////////

// // Index page
// app.get('/', (req,res) =>{
//     res.render('home')
// })

// // Search
// app.post('/search',async (req,res)=>{
//     let search_name = req.body.txtName

//     let server = await MongoClient.connect(url)

//     let dbo = server.db("ATNTOY")
   
//     let products = await dbo.collection('TOY').find({$or:[{'name': new RegExp(search_name,'i')},
//     {'price': new RegExp(search_name)}]}).toArray() 
//     res.render('AllProduct',{'products':products})
// })


// // Add new Product
// app.get('/create',(req,res)=>{
//     res.render('NewProduct')
// })

// // app.post('/NewProduct',async (req,res)=>{
// //     let name = req.body.txtName
// //     let price =req.body.txtPrice
// //     let picURL = req.body.txtPicture
// //     let description = req.body.txtDescription
// //     let amount = req.body.txtAmount
// //     let product = {
// //         'name':name,
// //         'price': price,
// //         'picURL':picURL,
// //         'description': description,
// //         'amount': amount
// //     }
// //     let client= await MongoClient.connect(url);
// //     let dbo = client.db("ATNTOY");
// //     await dbo.collection("TOY").insertOne(product);
// //     if (product == null) {
// //         res.render('/')
// //     }
// //     res.redirect('/viewAll')
    
// // })

// app.post('/NewProduct',async (req,res)=>{
//     let name = req.body.txtName 
//     let price = parseFloat(req.body.txtPrice)
//     let picURL = req.body.txtPicURL
//     let description = req.body.txtDescription
//     let amount = parseInt(req.body.txtAmount)

//     let product = {
//         'name':name,
//         'price': price,
//         'picURL':picURL,
//         'description': description,
//         'amount': amount
//     }
//     let client= await MongoClient.connect(url);
//     let dbo = client.db("ATNTOY");
//     if(name.length <= 0 || price <= 0 || picURL.length <= 0 || amount <= 0 )
//     { //validation
//         res.render('NewProduct', {add_err: 'Please enter field again'})
//     } else {
//         await dbo.collection("TOY").insertOne(product);
//         if (product == null) {
//             res.render('/')
//         }
//         res.redirect('/viewAll')
//     }
// })


// // All product
// app.get('/viewAll',async (req,res)=>{
//     var page = req.query.page
//     let client= await MongoClient.connect(url);
//     let dbo = client.db("ATNTOY");
//         let products = await dbo.collection("TOY").find().toArray()
//         res.render('AllProduct',{'products':products})
    
// })

// // Update product
// app.get('/update',async(req,res)=>{
//     let id = req.query.id;
//     const client = await MongoClient.connect(url)
//     let dbo = client.db("ATNTOY")
//     let products = await dbo.collection("TOY").findOne({_id : ObjectId(id)})
//     res.render('update', {'products': products})

// })
// app.post('/updateProduct', async(req,res)=>{
//     let id = req.body._id;
//     let name = req.body.txtName
//     let price =req.body.txtPrice
//     let picURL = req.body.txtPicture
//     let description = req.body.txtDescription
//     let amount = req.body.txtAmount
//     let client = await MongoClient.connect(url)
//     let dbo = client.db("ATNTOY")
//     console.log(id)
//     await dbo.collection("TOY").updateOne({_id: ObjectId(id)}, {
//          $set: {
//              'name': name,
//              'price': price,
//              'picURL': picURL,
//              'description': description,
//              'amount': amount
//          }
//     })
//     res.redirect('/viewAll')
// })

// // Delete product
// app.get('/delete',async(req,res)=>{
//     let id = mongo.ObjectId(req.query.id); 
//     const client = await MongoClient.connect(url);
//     let dbo = client.db("ATNTOY");
//     let collection = dbo.collection('TOY')  
//     let products = await collection.deleteOne({'_id' : id});
//     res.redirect('/viewAll')
// })

//---------------------------------------------------------------------------------------------------------
//Session

var session = require('express-session')

app.use(session({
    secret: 'my secrete !@#$$%%@@$%$@#%%@#%##',
    resave: false
}))

//function
function isAuthenticated(req, res, next) {
    let chuaDangNhap = !req.session.userName
    if (chuaDangNhap)
        res.redirect('/check')
    else
        next()
}

//Login
app.get('/login', (req, res) => {
    let accessCount = req.session.accessCount || 0
    accessCount++
    req.session.accessCount = accessCount
    let chuaDangNhap = !req.session.userName
    res.render('login', { 'accessCount': accessCount, 'chuaDangNhap': chuaDangNhap })
})

app.post('/register', async(req, res) => {
    let name = req.body.txtName
    let pass = req.body.txtPassword
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNTOY")
    req.session.userName = name
    let user = await dbo.collection("users").find({ $and: [{ 'name': name }, { 'pass': pass }] }).toArray()
    if (user.length > 0) {
        res.redirect('/viewAll')
    } else {
        res.write('khong hop le')
        res.end()
    }
})

//SignUp
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.post('/signupPro', async(req, res) => {
    let name = req.body.name
    let pass = req.body.pass
    let country = req.body.country
    if (name.length <= 3) {
        res.render('signup', { 'error': ">=5, right" })
        return
    }
    let account = {
        'name': name,
        'pass': pass,
        'country': country
    }
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNTOY")
    await dbo.collection("users").insertOne(account)
    res.redirect('/')
})

//Logout
app.get('/logout', (req, res) => {
    req.session.userName = null
    req.session.save((err) => {
        req.session.regenerate((err2) => {
            res.redirect('/')
        })
    })
})

// Index page
app.get('/', (req,res) =>{
    res.render('home')
})

// Search
app.post('/search',async (req,res)=>{
    let search_name = req.body.txtName

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNTOY")
   
    let products = await dbo.collection('TOY').find({$or:[{'name': new RegExp(search_name,'i')},
    {'price': new RegExp(search_name)}]}).toArray() 
    res.render('AllProduct',{'products':products})
})

app.post('/searchCUS',async (req,res)=>{
    let search_name = req.body.txtName

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNTOY")
   
    let products = await dbo.collection('TOY').find({$or:[{'name': new RegExp(search_name,'i')},
    {'price': new RegExp(search_name)}]}).toArray() 
    res.render('Product',{'products':products})
})


// Add new Product
app.get('/create', (req,res)=>{
    res.render('NewProduct')
})


app.post('/NewProduct',isAuthenticated, async (req,res)=>{
    let name = req.body.txtName 
    let price = parseFloat(req.body.txtPrice)
    let picURL = req.body.txtPicURL
    let description = req.body.txtDescription
    let amount = parseInt(req.body.txtAmount)

    let product = {
        'name':name,
        'price': price,
        'picURL':picURL,
        'description': description,
        'amount': amount
    }
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");

    let accessCount = req.session.accessCount || 0
    accessCount++
    req.session.accessCount = accessCount
    let chuaDangNhap = !req.session.userName
   
    let account = await dbo.collection('users').find({'name': req.session.userName}).toArray()

    if(name.length <= 0 || price <= 0 || picURL.length <= 0 || amount <= 0 )
    { //validation
        res.render('NewProduct', {add_err: 'Please enter field again'})
    } else {
        await dbo.collection("TOY").insertOne(product);
        if (product == null) {
            res.render('/', {'account': account, 'ID': req.sessionID, 'accessCount': accessCount, 'chuaDangNhap': chuaDangNhap})
        }
        res.redirect('/viewAll')
    }
})


// All product
app.get('/viewAll', isAuthenticated,async (req,res)=>{
    var page = req.query.page
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");

    let accessCount = req.session.accessCount || 0
    accessCount++
    req.session.accessCount = accessCount
    let chuaDangNhap = !req.session.userName
   
    let account = await dbo.collection('users').find({'name': req.session.userName}).toArray()
    
    
        let products = await dbo.collection("TOY").find().toArray()
        res.render('AllProduct',{'products':products, 'account': account, 'ID': req.sessionID, 'accessCount': accessCount, 'chuaDangNhap': chuaDangNhap})  
})

// Product for customer
app.get('/CusviewAll' ,async (req,res)=>{
    var page = req.query.page
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");
        let products = await dbo.collection("TOY").find().toArray()
        res.render('Product',{'products':products})
    
})

// Update product
app.get('/update', isAuthenticated,async(req,res)=>{
    let id = req.query.id;
    const client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")

    let accessCount = req.session.accessCount || 0
    accessCount++
    req.session.accessCount = accessCount
    let chuaDangNhap = !req.session.userName
   
    let account = await dbo.collection('users').find({'name': req.session.userName}).toArray()

    let products = await dbo.collection("TOY").findOne({_id : ObjectId(id)})
    res.render('update', {'products': products, 'account': account, 'ID': req.sessionID, 'accessCount': accessCount, 'chuaDangNhap': chuaDangNhap})

})
app.post('/updateProduct', async(req,res)=>{
    let id = req.body._id;
    let name = req.body.txtName
    let price =req.body.txtPrice
    let picURL = req.body.txtPicture
    let description = req.body.txtDescription
    let amount = req.body.txtAmount
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    console.log(id)
    await dbo.collection("TOY").updateOne({_id: ObjectId(id)}, {
         $set: {
             'name': name,
             'price': price,
             'picURL': picURL,
             'description': description,
             'amount': amount
         }
    })
    res.redirect('/viewAll')
})

// Delete product
app.get('/delete', isAuthenticated,async(req,res)=>{
    let id = mongo.ObjectId(req.query.id); 
    const client = await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");
    let collection = dbo.collection('TOY')  
    let products = await collection.deleteOne({'_id' : id});
    res.redirect('/viewAll')
})

////Sort
app.get('/sort_ascending_by_name', async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    var sort = {name: 1}
    let products = await dbo.collection("TOY").find().sort(sort).toArray()
    res.render('Product', {'products': products})
})

app.get('/sort_descending_by_name', async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    var sort = {name: -1}
    let products = await dbo.collection("TOY").find().sort(sort).toArray()
    res.render('Product', {'products': products})
})

app.get('/sort_ascending_by_price', async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    var sort = {price: 1}
    let products = await dbo.collection("TOY").find().sort(sort).toArray()
    res.render('Product', {'products': products})
})

app.get('/sort_descending_by_price', async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    var sort = {price: -1}
    let products = await dbo.collection("TOY").find().sort(sort).toArray()
    res.render('Product', {'products': products})
})