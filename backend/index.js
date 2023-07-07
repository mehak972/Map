import fetch from 'node-fetch';
import mongoose,{Schema} from 'mongoose';
import express from 'express';
import cors from 'cors';

mongoose.connect("mongodb://127.0.0.1:27017/map");

const GempaSchema = Schema({
    Tanggal: { type: String },
    Jam: { type: String },
    DateTime: { type: Date, required: true },
    Coordinates: { type: String, required: true },
    Lintang: { type: String, required: true },
    Bujur: { type: String, required: true },
    Magnitude: { type: String, required: true },
    Kedalaman: { type: String },
    Wilayah: { type: String, required: true },
    Dirasakan: { type: String },
  });
  
  const InfogempaSchema = new mongoose.Schema({
    Infogempa: {
      gempa: [GempaSchema],
    },
  });
  

    const info= mongoose.model('Infogempa',InfogempaSchema);   
    
   async function getPosts(){
    try{
    const myPosts= await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json");
    const response=await myPosts.json();
    const res=JSON.stringify(response, null,2)
   
    
    const gempaArray = response.Infogempa.gempa.map((gempaData) => gempaData);
      const post = new info({
        Infogempa: {
        gempa: gempaArray,
        },
        });

      
      await post.save();
      console.log("Post saved");
      
    }catch(error){
    console.log("An error occurred while saving ",error)
}
}

getPosts()




const app=express();
const port = 5000

app.use(cors())
app.use(express.json())

app.get('/api/map',(req,res)=>{
    info.find({})
    .then(Infogempa=>res.json(Infogempa))
    .catch(err=>res.json(err))
})


app.listen(port, () => {
  console.log(`Map App listening at http://localhost: ${port}`)
})