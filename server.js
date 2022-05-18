var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)
var mongoose = require("mongoose")
const { stringify } = require("querystring")
const { sendStatus } = require("express/lib/response")
var port = process.env.PORT || 5000

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dburl = "mongodb+srv://admin:43zjsgEjgQwF2ifo@cluster0.38mtl.mongodb.net/?retryWrites=true&w=majority"

var Message = mongoose.model("Message", {
    name: String,
    message: String
})

app.get('/messages', (req,res)=>{
    Message.find({}, (err,messages) =>{
        res.send(messages)
    })
})

app.post('/messages', (req,res)=>{
    var message = new Message(req.body)
    message.save((err)=> {
        if(err)
            sendStatus(500)
            
            res.sendStatus(200)
            io.emit("message",req.body)
    })
    
})
io.on("connection",(socket)=> {
    console.log("user connected")
})

mongoose.connect(dburl, (err)=> {
    console.log("MongoDB connection successful")
})

var server = http.listen(port, () => {
    console.log("Server is listening to port %d", port)
})
