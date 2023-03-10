const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// const server = require('http').Server(app)
// const io = require("socket.io")(server);
const User = require('./user.js')
const multer = require('multer')
const fs = require('fs')

const app = express()
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors())

const mongo_URI = 'mongodb+srv://vaibhav:Vaibhav48@cluster0.4ceuo4f.mongodb.net/REG?retryWrites=true&w=majority'

mongoose.connect(mongo_URI, {useNewUrlParser:true, useUnifiedTopology:true})
    .then(result => {console.log('Connected To DB')})
    .catch(err => console.error(err))
 
app.listen(3000)


// const Storage = multer.diskStorage({
//     destination:"uploads",
//     filename:(req, res, cb) =>
//     {
//         cb(null, file.originalname)
//     }
// })

// const upload = multer({storage: Storage})

app.post('/addUser', (req,res) => {
        const NewUser = new User ({
            Name : req.body.name,
            Company : req.body.company,
            City : req.body.city,
            Email: req.body.email,
            Img: req.body.IMGNAME
        }) // for testing
           console.log(NewUser)
        NewUser.save()
            .then(console.log('Added new User!'))
            .catch(err => {
                console.error(err)
            }); 
 
    // const data = JSON.parse(req.body)
    // console.log(req.body)
    // console.log(data) 
})


// app.post('/image-upload', imageUpload.array("my-image-file"), (req, res) => {
//   console.log('POST request received to /image-upload.');
//   console.log('Axios POST body: ', req.body);
//   res.send('POST request recieved on server to /image-upload.');
// })

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function(req, file, cb) {
//         fname = `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`
//       cb(null, fname)
//     }
//   })  
// const imageUpload = multer({storage: storage})

// app.post('/image-upload',imageUpload.array("my-image-file"), (req, res) => {
//     console.log('POST request received to /image-upload.');
//     // console.log('Axios POST body: ', req.body);
//     res.send(fname);
// }) 

app.post("/upload", (req, res) => {
    const data = req.body;
    const imageData = data.image64.replace(/^data:image\/\w+;base64,/, '');
     const buffer = Buffer.from(imageData, 'base64');
     const imgName = `./uploads/image${Date.now()}.png`
    fs.writeFile(imgName, buffer, err => {
          if (err) {  res.status(500).send({ error: 'Error saving image' })} 
          else {  res.send({ 'ImageName':imgName })
        }
    });  
});

app.get('/getUser', async (req, res)=>{
    // read data from serial port
    var id = '640ac921b38836eb73c238ea'; 
    await User.findById(id)
        .then((data) => {
            const name = data.Name
            const comp = data.Company
            const city = data.Status
            // const image = `data:${data.ImgFile.contentType}/;base64,`+Buffer.from(JSON.stringify(data.ImgFile.data)).toString('base64')
            // console.log(image)
            const image = data.Img
            res.send({'name':name, 'comp':comp, 'city':city, 'image':image})
        })
        .catch(err => console.error(err))
})
