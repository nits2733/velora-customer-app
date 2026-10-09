export type MapPlace = {
  name: string
  lat: number
  lng: number
  status?: 'Active' | 'Upcoming'
}

export type MapSelection = { name: string; lat: number; lng: number }

// Leaflet + OpenStreetMap page shared by the native (WebView) and web (iframe) maps.
export function buildLocationMapHtml(places: MapPlace[], accent: string): string {
  const data = JSON.stringify(places).replace(/</g, '\\u003c')
  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{height:100%;margin:0;padding:0}</style>
</head><body><div id="map"></div>
<script>
var places = ${data};
var accent = ${JSON.stringify(accent)};
var map = L.map('map', { zoomControl: true }).setView([17.4401, 78.4], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function send(sel) {
  var msg = JSON.stringify(sel);
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(msg);
  else window.parent.postMessage(msg, '*');
}

function dot(color) {
  return L.divIcon({
    className: '',
    html: '<div style="width:18px;height:18px;border-radius:50%;background:' + color + ';border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
    iconSize: [18, 18], iconAnchor: [9, 9]
  });
}

var pin = null;
function setPin(lat, lng) {
  if (pin) map.removeLayer(pin);
  pin = L.marker([lat, lng], { icon: dot(accent) }).addTo(map);
}

places.forEach(function (p) {
  var m = L.marker([p.lat, p.lng], { icon: dot(p.status === 'Upcoming' ? '#b58a2b' : '#2f7a4d') }).addTo(map);
  m.bindTooltip(p.name.split(',')[0]);
  m.on('click', function () { setPin(p.lat, p.lng); send({ name: p.name, lat: p.lat, lng: p.lng }); });
});

window.__focus = function (lat, lng) { setPin(lat, lng); map.setView([lat, lng], 14); };

map.on('click', function (e) {
  var lat = e.latlng.lat, lng = e.latlng.lng;
  setPin(lat, lng);
  var fallback = lat.toFixed(4) + ', ' + lng.toFixed(4);
  fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&lat=' + lat + '&lon=' + lng)
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var a = d.address || {};
      var parts = [a.neighbourhood || a.suburb || a.road, a.city || a.town || a.village || a.state_district]
        .filter(Boolean);
      send({ name: parts.length ? parts.join(', ') : (d.display_name || fallback), lat: lat, lng: lng });
    })
    .catch(function () { send({ name: fallback, lat: lat, lng: lng }); });
});
</script></body></html>`
}
