import"./theme-bU7hyL3V.js";/* empty css             */import"./main-Bs780hrD.js";let s=new Howl({src:["/audios/romantic-saxophone-244539.mp3"],loop:!0,volume:.5});const n=document.getElementById("musicToggle");let o=!1;n.addEventListener("click",()=>{o?(s.pause(),n.classList.remove("playing")):(s.play(),n.classList.add("playing")),o=!o});document.addEventListener("click",function t(){o||(s.play(),n.classList.add("playing"),o=!0),document.removeEventListener("click",t)},{once:!0});document.addEventListener("DOMContentLoaded",function(){const t=6.241362256908526,i=-75.58840591379317,e=L.map("map").setView([t,i],15);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(e);const a=L.icon({iconUrl:"assets/images/logo.svg",iconSize:[32,32],iconAnchor:[16,32],popupAnchor:[0,-32]});L.marker([t,i],{icon:a}).addTo(e).bindPopup(`
        <div style="text-align: center;">
            <h5 style="color: #ff4d6d; margin-bottom: 8px;">Flores para San Valentín</h5>
            <p style="margin: 0;">Av. Principal 123, Ciudad</p>
            <p style="margin: 5px 0;"><strong>Tel:</strong> +57 300 123 4567</p>
        </div>
    `).openPopup(),L.circle([t,i],{color:"red",fillColor:"#f03",fillOpacity:.5,radius:500}).addTo(e),e.zoomControl.setPosition("bottomright")});
