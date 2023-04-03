var IMGNAME;
var _ID;
var DATA;
var NAME;
var COMPANY;



function frameTwo(){
    document.getElementById('frame1').style.display = 'none'
    document.getElementById('frame2').style.display = 'block'
    const clear = setTimeout(()=>{
        document.getElementById('frame2').style.display = 'none'
        document.getElementById('frame3').style.display = 'block'
        clearTimeout(clear)
    },1000)
}


(() => {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    const width = 1080; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    let streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;
  
    function showViewLiveResultButton() {
      if (window.self !== window.top) {
        // Ensure that if our document is in a frame, we get the user
        // to first open it in its own tab or window. Otherwise, it
        // won't be able to request permission for camera access.
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
      }
      return false;
    }
  

    function startup() {
      if (showViewLiveResultButton()) {
        return;
      }
      video = document.getElementById("video");
      canvas = document.getElementById("canvas");
      photo = document.getElementById("photo");
      startbutton = document.getElementById("startbutton");
  
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
  
      video.addEventListener(
        "canplay",
        (ev) => {
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
  
            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.
  
            if (isNaN(height)) {
              height = width/ (4 / 3);
            }
  
            // video.setAttribute("width", width);
            // video.setAttribute("height", height);
            // canvas.setAttribute("width", width);
            // canvas.setAttribute("height", height);
            streaming = true;
          }
        },
        false
      );
  
      startbutton.addEventListener(
        "click",
        (ev) => {
          takepicture();
          ev.preventDefault();
        },
        false
      );
  
    //   clearphoto();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    // function clearphoto() {
    //   const context = canvas.getContext("2d");
    //   context.fillStyle = "#AAA";
    //   context.fillRect(0, 0, canvas.width, canvas.height);
    //   const data = canvas.toDataURL("image/png");
    //   photo.setAttribute("src", data);
    // }
  
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takepicture() {
        document.getElementById('video').style.display = 'none'
        document.getElementById('startbutton').style.display = 'none'
        document.getElementById('canvas').style.display = 'block'
        document.getElementById('Retake').style.display = 'block'
        document.getElementById('next').style.display = 'block'
      const context = canvas.getContext("2d");
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        // canvas.style.display = 'block'
        DATA = canvas.toDataURL("image/png");
        // console.log(DATA)
        // photo.setAttribute("src", data);
      } else {
        clearphoto();
      }
    }
  
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener("load", startup, false);
})();


function showVideo(){
    document.getElementById('opening').style.display = 'none'
    document.getElementById('video').style.display = 'block'
    document.getElementById('startbutton').style.display = 'block'
    document.getElementById('Retake').style.display = 'block'
    document.getElementById('next').style.display = 'block'
    // console.log('Button Clicked!')
}

function retake(){
    document.getElementById('canvas').style.display = 'none'
    document.getElementById('video').style.display = 'block'
    document.getElementById('Retake').style.display = 'none'
    document.getElementById('next').style.display = 'none'
    document.getElementById('startbutton').style.display = 'block'
}

function regPage(){
  // event.preventDefault()
  submitImage()
  document.getElementById('frame3').style.display = 'none'
  document.getElementById('Registration').style.display = 'flex'
}

async function handleSubmit(){
    // e.preventDefault()
    NAME = document.getElementById("fname").value
    const email = document.getElementById("email1").value
    COMPANY = document.getElementById("company").value
    const city = document.getElementById("city").value
    const phone = document.getElementById("phone").value

    if(!NAME || !email || !COMPANY || !city ||!phone){
    alert("Please fill all fields")
    }
    else{
        const data= {NAME, COMPANY, email, phone, city, IMGNAME}
        // console.log(data)
        const options1 = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        await fetch('http://localhost:3000/addUser', options1)
                .then(response=>response.json())
                .then(data=>{
                    _ID = data._ID
                    console.log(_ID)})
                .then(showPrint())
                }
}

async function submitImage(){
  const canvas =  document.getElementById('canvas')
  const image64 = canvas.toDataURL();
  const data = { image64 };
  const options1 = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const res = await fetch('http://localhost:3000/upload', options1)
  const res_data = await res.json()
  IMGNAME = res_data.ImageName
  console.log(IMGNAME)
}

function showPrint(){
  // e.preventDefault()
    console.log('Inside PrintBadge')
    document.getElementById('over').style.display = 'none'
    document.getElementById('Registration').style.display = 'none'
    document.getElementById('PrintBadge').style.display = 'flex'
    document.getElementById('icard').src = DATA
    document.getElementById('Name').innerHTML += NAME
    document.getElementById('Company').innerHTML += COMPANY
}

function printBadge(){
  downloadReceipt()
    document.getElementById('PrintBadge').style.display = 'none'
    document.getElementById('rf_id').style.display = 'flex'
}

async function rfidSubmit(){
    const rfid = document.getElementById("rfid").value

    if(!rfid){
    alert("Please Enter the RFID on your Tag")
    }
    else{
        const data= {rfid, _ID}
        // console.log(data)
        const options1 = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        await fetch('http://localhost:3000/addRFID', options1)
                .then(console.log('successfully Added rfid'))
                .then(showThanks())
}
}

function showThanks(){
    document.getElementById('rf_id').style.display = 'none'
    document.getElementById('showThanks').style.display = 'flex'   
}


function downloadReceipt() {
  document.getElementById('print').style.display = 'none'
  const data = document.getElementById('badge');
  html2canvas(data,{allowTaint:true}).then(async(canvas) => {
  const image64 = canvas.toDataURL();
  const data = { image64 };
  const options1 = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  };
  const response = await fetch('http://localhost:3000/upload', options1)
  const res_data = await response.json()
  console.log(res_data.ImageName)  
  })
}

// const socket = io()

// socket.on('image', (data)=>
// {
//     if(data){
//         document.getElementById('show').style.display = 'flex'
//         const parsedData = JSON.parse(data)
//         IMGNAME = parsedData.image;
//         console.log(parsedData)
//         document.getElementById('image').src = `data:image/png;base64,${parsedData.Imgfile}`
//         // document.getElementById('image').alt = parsedData.Imgname
//         document.getElementById('Name').innerHTML = parsedData.Name
//         document.getElementById('Company').innerHTML = parsedData.Company
//     }
// }
// )