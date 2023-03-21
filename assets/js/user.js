const socket = io()

socket.on('image', (data)=>
{
    if(data){
        const parsedData = JSON.parse(data)
        IMAGENAME = parsedData.image;
        console.log(parsedData)
        document.getElementById('image').src = `data:image/png;base64,${parsedData.Imgfile}`
        document.getElementById('image').alt = parsedData.Imgname
        document.getElementById('Name').innerHTML = parsedData.Name
        document.getElementById('Company').innerHTML = parsedData.Comapany
    }
})