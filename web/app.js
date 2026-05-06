const map = L.map("map", {
  zoomControl: false,
}).setView([44.2227, 12.0407], 12);

L.control.zoom({
  position: "bottomleft",
}).addTo(map);

const baseMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let boundaryLayer;
let floodLayer;
let roadsLayer;
let schoolsLayer;
let hospitalsLayer;

const styles = {
  boundary: {
    color: "#1F2933",
    weight: 1.2,
    fillOpacity: 0,
  },
  flood: {
    color: "#2F80C0",
    weight: 0.6,
    fillColor: "#9DCEF2",
    fillOpacity: 0.35,
  },
  roads: {
    color: "#F59E0B",
    weight: 1.2,
    opacity: 0.65,
  },
  schools: {
    radius: 7,
    fillColor: "#F97373",
    color: "#FFFFFF",
    weight: 1.5,
    opacity: 1,
    fillOpacity: 0.9,
  },
  hospitals: {
    radius: 9,
    fillColor: "#DC2626",
    color: "#FFFFFF",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.95,
  },
};

async function loadGeoJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load ${url}`);
  }

  return response.json();
}

function bindSimplePopup(layer, title, properties = {}) {
  const rows = Object.entries(properties)
    .filter(([_, value]) => value !== null && value !== undefined && value !== "")
    .slice(0, 5)
    .map(([key, value]) => `<strong>${key}</strong>: ${value}`)
    .join("<br>");

  layer.bindPopup(`
    <strong>${title}</strong>
    ${rows ? `<br>${rows}` : ""}
  `);
}

async function initMap() {
  try {
    const [
      boundaryData,
      floodData,
      roadsData,
      schoolsData,
      hospitalsData,
    ] = await Promise.all([
      loadGeoJSON("data/forli_boundary.geojson"),
      loadGeoJSON("data/forli_mph_flood_hazard.geojson"),
      loadGeoJSON("data/forli_roads_affected_mph.geojson"),
      loadGeoJSON("data/forli_schools_exposed_mph.geojson"),
      loadGeoJSON("data/forli_hospitals_exposed_mph.geojson"),
    ]);

    floodLayer = L.geoJSON(floodData, {
      style: styles.flood,
      onEachFeature: (feature, layer) => {
        bindSimplePopup(layer, "Medium Probability Flood Hazard", feature.properties);
      },
    }).addTo(map);

    roadsLayer = L.geoJSON(roadsData, {
      style: styles.roads,
      onEachFeature: (feature, layer) => {
        bindSimplePopup(layer, "Affected road segment", feature.properties);
      },
    }).addTo(map);

    schoolsLayer = L.geoJSON(schoolsData, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, styles.schools),
      onEachFeature: (feature, layer) => {
        bindSimplePopup(layer, "Exposed school", feature.properties);
      },
    }).addTo(map);

    hospitalsLayer = L.geoJSON(hospitalsData, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, styles.hospitals),
      onEachFeature: (feature, layer) => {
        bindSimplePopup(layer, "Exposed hospital", feature.properties);
      },
    }).addTo(map);

    boundaryLayer = L.geoJSON(boundaryData, {
      style: styles.boundary,
      onEachFeature: (feature, layer) => {
        bindSimplePopup(layer, "Comune di Forlì boundary", feature.properties);
      },
    }).addTo(map);

    map.setView([44.2227, 12.0407], 12.4);

    setupLayerToggles();
  } catch (error) {
    console.error(error);
    alert("Some map data could not be loaded. Check the GeoJSON file paths.");
  }
}

function setupLayerToggles() {
  const toggles = [
    ["toggleFlood", floodLayer],
    ["toggleRoads", roadsLayer],
    ["toggleSchools", schoolsLayer],
    ["toggleHospitals", hospitalsLayer],
  ];

  toggles.forEach(([id, layer]) => {
    const checkbox = document.getElementById(id);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        layer.addTo(map);
      } else {
        map.removeLayer(layer);
      }
    });
  });
}

initMap();