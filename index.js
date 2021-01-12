require('dotenv').config()

const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
app.use(express.static('public'))
app.set('view engine', 'ejs')
const mongoose = require('mongoose');

const ProductItem = require('./models/productItem')

//mongoose se une a nuestro DB y luego al port
//Función asincrónica: usamos .then y .catch
//La conexión debe realizarse antes del app.get:
mongoose.connect(process.env.dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        console.log('Connected to my DB')
        //primero debe funcionar el servidor, y luego nos conectamos a la DB,así que ponemos app.listen aquí!
        app.listen(PORT, () => console.log(`http://localhost: ${PORT}`))
    })
    .catch(err => console.log(err))



//en la pág. index es donde nos saldrá la galería con todos los productos.//para que se nos muestre el DB, necesitamos el método .find (.then, .catch)
app.get('/', (req, res) => {
    ProductItem.find()
    .then(result => {
        res.render('index', {productData: result})
    })
    .catch(err => console.log(err))
})


//wenn wir auf den link "add" clicken, queremos que se añada una nueva foto a la galeria. O sea, queremos crear algo nuevo. 
//podríamos hacer un app.post en lugar de app.get, pej si tenemos un formulario
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/add', (req, res) => {
    res.render('add')
})
app.post('/add-info', (req, res) => {
    // console.log(req.body);
    const newProductItem = new ProductItem({
        productName: req.body.productName, 
        pictureLink: req.body.pictureLink, 
        company: req.body.company,
        price: req.body.price, 
        description: req.body.description,
        shopLink: req.body.shopLink

    })
    newProductItem.save()
    .then(result => {
        // res.send(result)
        res.redirect('/')
    })
    .catch(err => console.log(err))
})