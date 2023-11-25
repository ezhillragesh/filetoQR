const express = require("express");
const path=require("path");
const app=express();

const publicPath = path.join(__dirname, "..", "client");
app.use(express.static(publicPath, { extensions: ['html', 'css','js'] }));



app.get("/*",(req, res)=> {
    res.sendFile(path.join(publicPath, "index.html"));
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
})