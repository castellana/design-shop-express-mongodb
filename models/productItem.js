//necesitamos mongoose!
const mongoose = require('mongoose')

//Schema aus mongoose holen (class constructor function, also mayúsculas!)
const Schema = mongoose.Schema

//configuramos nuestro consjunto de datos, con new (dentro una función con un objeto)
const productItemSchema = new Schema({
    productName: {
        type: String, //String mayúsculas!
        required: true
    },
    pictureLink: {
        type: String, 
        required: false
    },
    company: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shopLink: {
        type: String,
        required: false
    }
}, {timestamps: true}) //cuando hagamos una entrada, nos creará un created at ó un updated at

//Ahora creamos un modelo con('nombre de colección', nombre del Schema)
//collection name es importante! En el DB se va a reescribir en plural(z.B. GalleryDBs)
const ProductItem = mongoose.model('DBProduct', productItemSchema)

//exportieren!
module.exports = ProductItem