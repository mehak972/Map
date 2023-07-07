import React,{useState,useEffect} from 'react';
import data1 from './db.json';
import ReactMapGl, { Marker,Popup } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import axios from 'axios';

function Map() {

const[data,setData]=useState([]);
const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);

function handleClick(index) {
  setSelectedMarkerIndex(index);
}

                        // Coordinates

  const coordinatesArray = data[0]?.Infogempa?.gempa.map((gempa) => {
    const latitudeValue = gempa.Lintang;
    const longitudeValue = gempa.Bujur;
    const numericalValueLati = parseFloat(latitudeValue);
    const numericalValueLong = parseFloat(longitudeValue);
    const latitude = latitudeValue.includes("LS") ? -numericalValueLati : numericalValueLati;
    const longitude = longitudeValue.includes("BT") ? numericalValueLong : -numericalValueLong;
    return { latitude, longitude };
  });
  console.log(coordinatesArray);

                                // dateTime

  const dateTime= data[0]?.Infogempa?.gempa.map((gempa)=>{
  const dateTimeData = new Date(gempa.DateTime);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const readableDateTime = dateTimeData.toLocaleString('en-US', options);
  return {readableDateTime}
})
console.log(dateTime);


let[viewPort,setViewPort]=useState({
    latitude:  -8.650000,
    longitude:115.216667,
    zoom:8,
    height:window.innerHeight,
    width:window.innerWidth,
    
});



useEffect(()=>{
    axios.get('http://localhost:5000/api/map')
    
    .then((response)=>setData(response.data))
    .catch((error)=>console.log(error))
},[])


console.log(data[0]?.Infogempa?.gempa);


    return (
    <div style={{width:"100vw", height:"100vh"}}>
      
      <ReactMapGl
       {...viewPort}
       mapboxAccessToken={'pk.eyJ1IjoibWVoYWs1MzAiLCJhIjoiY2xqbjFreDFqMWFuYTNncXF5dHd0eDNoMyJ9.PcqJcjJrR4ynlsRaAZJ2iw'}
       mapStyle="mapbox://styles/mehak530/cljmsmwvz00c101qw2tt558mu"
       onMove={(evt) => setViewPort(evt.viewPort)}
      >
    
        {data[0]?.Infogempa?.gempa.map((data,index)=>(
        <Marker key={index}  latitude={coordinatesArray[index].latitude} longitude={coordinatesArray[index].longitude}
        onClick={() => handleClick(index)}
        >
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Icone_Vermelho.svg/512px-Icone_Vermelho.svg.png?20201119174958"
            width={50}
            height={50}
        />

        </Marker>
          ))}

          {selectedMarkerIndex !== null && (
             <Popup
              latitude={coordinatesArray[selectedMarkerIndex].latitude}
              longitude={coordinatesArray[selectedMarkerIndex].longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setSelectedMarkerIndex(null)}
              anchor="top"
              >
              <div style={{fontSize:"10px"}}>
                <h2>Coordinates: {coordinatesArray[selectedMarkerIndex].latitude}, {coordinatesArray[selectedMarkerIndex].longitude}</h2>
                <p>Magnitude: {data[0]?.Infogempa?.gempa[selectedMarkerIndex].Magnitude}</p>
                <p>DateTime: {dateTime[selectedMarkerIndex].readableDateTime}</p>
                <p>Region(Wilayah):{data[0]?.Infogempa?.gempa[selectedMarkerIndex].Wilayah}</p>
              </div>
            </Popup>
                )}
          </ReactMapGl>
    </div>
  )
}

export default Map







