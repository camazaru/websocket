const { Socket } = require('dgram')
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const { Server: IOServer } = require('socket.io')
const expressServer = app.listen(8080, () => { console.log('Servisdor conectado pueto 8080') })
const io = new IOServer(expressServer)
const productos = [{ title: "Nuevo 01", price: "99.9", thumbnail: "Imagen Nueva" },
    { title: "Nuevo 02", price: "99.98", thumbnail: "Imagen Nueva" },
    { title: "Nuevo 03", price: "99.97", thumbnail: "Imagen Nueva" }
]
const messagesArray = []
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', socket => {
    console.log(`Usuario Nuevo Conectado ${socket.id}`)
    socket.on('client:product', productInfo => {
        productos.push(productInfo)
        io.emit('server:productos', productos)
        console.log(productos)
    })
    socket.emit('server:productos', productos)

    socket.emit('server:mensajes', messagesArray)
    socket.on('client:menssage', messageInfo => {
        fs.appendFileSync(`./Messages/appMensajes.txt`, JSON.stringify(messageInfo))
        messagesArray.push(messageInfo)
        io.emit('server:mensajes', messagesArray)

    })
})