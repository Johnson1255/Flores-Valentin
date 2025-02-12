document.addEventListener('DOMContentLoaded', function() {
    const lat = 6.241362256908526;
    const lng = -75.58840591379317;

    const map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const customIcon = L.icon({
        iconUrl: 'assets/images/logo.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    marker.bindPopup(`
        <div style="text-align: center;">
            <h5 style="color: #ff4d6d; margin-bottom: 8px;">Flores para San Valentín</h5>
            <p style="margin: 0;">Av. Principal 123, Ciudad</p>
            <p style="margin: 5px 0;"><strong>Tel:</strong> +57 300 123 4567</p>
        </div>
    `).openPopup();

    var circle = L.circle([lat, lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);

    map.zoomControl.setPosition('bottomright');
});