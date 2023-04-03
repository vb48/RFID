const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// const server = require('http').Server(app)
// const io = require("socket.io")(server);
const User = require('./user.js')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()

const http = require('http');
const server = require("http").Server(app);
const io = require("socket.io")(server);

// const { SerialPort } = require('serialport')
// const { ReadlineParser } = require('@serialport/parser-readline')
// const usbport = new SerialPort({ path: 'COM5', baudRate: 115200 })

// const parser = usbport.pipe(new ReadlineParser(({ delimiter: '\r\n' })))
//     parser.on('data', async function (reader){
//     console.log(reader)
// })

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile)
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/assets', express.static(path.join(__dirname, 'js')))
app.use(express.static(__dirname+'/public/'));

app.use(cors())

const mongo_URI = 'mongodb+srv://vaibhav:Vaibhav48@cluster0.4ceuo4f.mongodb.net/REG?retryWrites=true&w=majority'

mongoose.connect(mongo_URI, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(result => {console.log('Connected To DB')})
    .catch(err => console.error(err))
  
// app.listen(3000)
server.listen(3000, () => console.log('Server started on Port 3000'))

io.on('connection', () => {
    console.log('a user connected')
    // const parser = usbport.pipe(new ReadlineParser(({ delimiter: '\r\n' })))
    parser.on('data', async function (reader){
    console.log(reader)
    var id = reader;
    await User.findOne({RFID:id})
        .then((data) => {
            const name = data.Name
            const comp = data.Company
            const image = data.Img
            // const city = data.Status
            // const email = data.Email
            // res.send({'name':name, 'comp':comp, 'city':city, 'image':image})
            const image64 = fs.readFileSync(image)
            const imageBase64 = Buffer.from(image64).toString('base64')
            const jsonData = {
                Imgname: image.split('/').pop(),
                Imgfile:imageBase64,
                Name:name, 
                Company:comp,
            }
            // console.log(jsonData)
            const jsonString = JSON.stringify(jsonData)
            // send it using socket.io
            io.emit('image', jsonString)
            // res.send(jsonString)
            })
        .catch(err => console.error(err))
})
})

app.post('/addUser', (req,res) => {
        const NewUser = new User ({
            Name : req.body.NAME,
            Company : req.body.COMPANY,
            City : req.body.city,
            Email: req.body.email,
            Phone: req.body.phone,
            Img: req.body.IMGNAME,
            RFID: 'yes'
        }) // for testing
           console.log(NewUser)
           const id = NewUser._id.toString()
           NewUser.save()
           .then(console.log('Added New User!'))
           .then(res.send({ '_ID':id }))
           .catch(err => {
               console.error(err)
            }); 
            console.log(NewUser._id.toString()) 
 
    // const data = JSON.parse(req.body)
    // console.log(req.body)
    // console.log(data) 
})


app.post("/upload", (req, res) => {
    const data = req.body;
    const imageData = data.image64.replace(/^data:image\/\w+;base64,/, '');
     const buffer = Buffer.from(imageData, 'base64');
     const imgName = `./uploads/image${Date.now()}.png`
    fs.writeFile(imgName, buffer, err => {
          if (err) {  res.status(500).send({ error: 'Error saving image' })} 
          else {  res.send({ 'ImageName':imgName })}
    });  
});


app.get('/getUser', async (req, res)=>{
    res.render('showUser.html')
})


app.post('/addRFID', async(req, res)=>{
    // console.log(NewUser)
    User.findByIdAndUpdate(req.body._ID, {RFID:req.body.rfid})
        .then(res.status(201))
        .then(console.log('successfully Added rfid'))
        .catch(err => {
            console.error(err)
        });
})

app.get('/',(req,res)=>{
    res.render('index.html')
})
