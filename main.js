var expesss = require('express')
const {insertNewProduct, getAllProducts, deleteProductById, updateProduct, findProductById, findProductByName} = require('./databaseHandler')
var app = expesss()

const hbs = require('hbs')
app.set('view engine','hbs')
app.use(expesss.urlencoded({extended:true}))
app.use(expesss.static('public'))



hbs.registerHelper('color', function(price){
    if(price >= 50) {
        return 'red'
    } else {
        return 'blue'
    }
});


app.get('/',async (req,res)=>{
    let results = await getAllProducts()
    res.render('home',{'results':results})
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    await deleteProductById(id)
    res.redirect('/')
})

app.get('/new',(req,res)=>{
    res.render('newProduct')
})

app.post('/new',async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picUrl = req.body.txtPic
    const quantity = req.body.txtQuantity 
    if (name.length < 5) {
        res.render('newProduct', {'warning': "Not enough length for name"})
    }
    else if (price < 10 || price > 1500) {
        res.render('newProduct', {'warning' : "Invalid price"})
    }
    else {
        const newProduct = { 
            name: name, 
            price: Number.parseFloat(price),
            picture: picUrl,
            quantity: quantity,
        }
        await insertNewProduct(newProduct)
        res.redirect('/')
    }
})

app.post('/edit',async(req,res)=>{
    const id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picUrl = req.body.txtPic
    const quantity = req.body.txtQuantity
    await updateProduct(id, name, price, picUrl, quantity)
    res.redirect('/')
})


app.get('/edit',async(req,res)=>{
    const id = req.query.id
    const productToEdit = await findProductById(id)
    res.render("edit",{product:productToEdit})
})

app.post('/search',async(req,res)=>{
    const searchName = req.body.txtName
    const searchResult = await findProductByName(searchName) //await la đợi câu lệnh này thực hiện xong r mới chạy tiếp 
    res.render('home',{results:searchResult})
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running!")