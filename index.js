require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000
app.use(express.static('public'))
app.set('view engine', 'ejs')

//model:
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
    ProductItem.find()
    .then(result => {
        // console.log('result:', result)
        // console.log('result length:', result.length);
        const productData = result
        const randomData = productData.sort(() => .5 - Math.random()).slice(0,6)
        //  console.log('randomData .5: ', randomData);
    res.render('add', {productData, randomData})
    })
    .catch(err => console.log(err))
})

///add ó un paso intermedio pwj add-info
app.post('/add', (req, res) => {
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

//Queremos ver detalles de un producto concreto:
app.get('/details/:productId', (req, res) => {
    console.log('req.params.productId', req.params.productId);
    // res.end()
    ProductItem.findById(req.params.productId)
  .then((result) => {
    //   res.send(result)
      res.render('details', {product: result})
  })
  .catch(err => console.log(err))
})

//Queremos editar los datos de un producto:
app.post('/details/:productId/edit', (req, res) => {
    // console.log(req.body)
    const updatedProduct = {
        productName: req.body.productName, 
        pictureLink: req.body.pictureLink, 
        company: req.body.company,
        price: req.body.price, 
        description: req.body.description,
        shopLink: req.body.shopLink
    }
    ProductItem.findByIdAndUpdate(req.params.id,  updatedProduct)
    //..oder ProductItem.findByIdAndUpdate(req.params.id, req.body)
    .then(result => res.redirect(`/details/${req.params.id}`))
    .catch(err => console.log(err))
})


app.get('/deleted', (req, res) => {
    res.render('deleted')
})

//Eliminar un producto:(lo que esté detrás de ":", debe estar también detrás de "req.params....")
app.get('/details/:productId/delete', (req, res) => {
    ProductItem.findByIdAndDelete(req.params.productId)
    .then(result => res.redirect('/deleted'))
    .catch(err => console.log(err))
})


//less than$30 Page
app.get('/lessThan30', (req, res) => {
    ProductItem.find({"price": { "$lt":"30" }})
    // console.log("resultados:", resultados)
    .then(result => {
        console.log(result);
        res.render('lessThan30', {cheapData: result})
    })
    .catch(err => console.log(err))
})

//Weekly Recommendations
app.get('/weekly', (req, res) => {
    ProductItem.find()
    .then(result => {
        const weeklyData = result.sort(() => .5 - Math.random()).slice(0,3)
    res.render('weekly', {weeklyData})
    })
    .catch(err => console.log(err))
})


app.use((req, res) => {
    res.status(404).render('404')
})
