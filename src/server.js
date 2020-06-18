const express = require('express');
const path = require('path')


//Create Server
const server = express()

//Configure Server
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'../public')
server.use(express.static(publicDirectoryPath))


//Route Handlers


//Start Server
server.listen(port, (error,response)=>{
    if(error){
        console.log(error);
    }else{
        console.log('Server is up and running on port: ' + port)
    }
})