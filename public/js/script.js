const socket=io();
if(navigator.geolocation){
  navigator.geolocation.watchPosition((position)=>{
 const {latitude,longitude}=position.coords;
    socket.emit('send-location',{latitude,longitude});
  },(error)=>{
    console.error('Error getting location:', error);
  },
{
    enableHighAccuracy: true,
    maximumAge:0,
    timeout:5000
});
}
const map=L.map("map").setView([0, 0], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "SAM-X18"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 13);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    const marker = L.marker([latitude, longitude]).addTo(map);
    markers[id] = marker;
  }
});

socket.on("user-disconnected", (id) => {
  // Remove the user's marker from the map
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});