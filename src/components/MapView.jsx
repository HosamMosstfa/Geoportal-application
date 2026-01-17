import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import ChartsSection from "./ChartsSection";

const MapView = forwardRef(function MapView({ theme }, ref) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const stationsDataRef = useRef(null);

  const [layersVisibility, setLayersVisibility] = useState({
    area: true,
    roads: true,
    boundary: true,
    hillshade: true,
  });

  const [baseMap, setBaseMap] = useState('default');

  const [selectedStation, setSelectedStation] = useState('');

  const baseMapStyles = {
    default: "https://demotiles.maplibre.org/style.json",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    imagery: "https://api.maptiler.com/maps/satellite/style.json?key=oh2RuUJTGdHt3cFgDcV7", // Replace with actual API key
  };

  const [stationsData, setStationsData] = useState(null);
  const [newPointsData, setNewPointsData] = useState(null);
  const [newPointsGeoJSON, setNewPointsGeoJSON] = useState(null);
  const [allStationsData, setAllStationsData] = useState(null);

const [legendOpen, setLegendOpen] = useState(true);
  const toggleLayer = (layer) => {
    const map = mapRef.current;
    if (!map || !layersVisibility) return;
    const visibility = !layersVisibility[layer];
    setLayersVisibility(prev => ({ ...prev, [layer]: visibility }));
    if (layer === 'area') {
      map.setLayoutProperty('area-fill', 'visibility', visibility ? 'visible' : 'none');
      map.setLayoutProperty('area-outline', 'visibility', visibility ? 'visible' : 'none');
    } else if (layer === 'roads') {
      map.setLayoutProperty('roads-line', 'visibility', visibility ? 'visible' : 'none');
    } else if (layer === 'boundary') {
      map.setLayoutProperty('boundary-fill', 'visibility', visibility ? 'visible' : 'none');
      map.setLayoutProperty('boundary-outline', 'visibility', visibility ? 'visible' : 'none');
    } else if (layer === 'hillshade') {
      map.setLayoutProperty('hillshade-image-layer', 'visibility', visibility ? 'visible' : 'none');
    }
  };

  const changeBaseMap = (newBaseMap) => {
    setBaseMap(newBaseMap);
    const map = mapRef.current;
    if (map) {
      map.setStyle(baseMapStyles[newBaseMap]);
      // Re-add layers after style change
      map.once('style.load', () => {
        addLayersToMap(map, newBaseMap, newPointsGeoJSON);
        bindStationPopupEvents(map, newPointsGeoJSON);
      });
    }
  };


  const zoomToStation = (stationName) => {
    setSelectedStation(stationName);
    if (!stationsData || !stationName) return;
    const station = stationsData.features.find(f => f.properties.Name === stationName);
    if (station && station.geometry && station.geometry.coordinates) {
      const map = mapRef.current;
      if (map) {
        map.flyTo({
          center: station.geometry.coordinates,
          zoom: 18,
          duration: 2000
        });
      }
    } else {
      console.warn('Station not found:', stationName);
    }
  };

  const addLayersToMap = (map, currentBaseMap = baseMap, newPointsGeoJSON = null) => {
    // 🔹 Terrain
    if (!map.getSource('terrain')) {
      map.addSource("terrain", {
        type: "raster-dem",
        tiles: [
          "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        encoding: "terrarium",
        maxzoom: 11
      });
    }

    if (!map.getLayer('hillshade')) {
      map.setTerrain({
        source: "terrain",
        exaggeration: 1.5
      });

      map.addLayer({
        id: "hillshade",
        type: "hillshade",
        source: "terrain"
      });
    }

    // 🔹 Hillshade Image - Only add for dark base map
    if (currentBaseMap === 'dark' && !map.getSource('hillshade-image')) {
      map.addSource("hillshade-image", {
        type: "image",
        url: "/data/Hillshade_NoData_1.png",
        coordinates: [
          [39.854, 21.46], // top left
          [40.015, 21.46], // top right
          [40.015, 21.326], // bottom right
          [39.854, 21.326]  // bottom left
        ]
      });
      map.addLayer({
        id: "hillshade-image-layer",
        type: "raster",
        source: "hillshade-image",
        paint: {
          "raster-opacity": 0.7
        }
      });
    }

    // 🔹 Polygon GeoJSON
    if (!map.getSource('my-geojson')) {
      map.addSource("my-geojson", {
        type: "geojson",
        data: "/data/layer.geojson"
      });

      map.addLayer({
        id: "geojson-fill",
        type: "fill",
        source: "my-geojson",
        paint: {
          "fill-color": "#000000",
          "fill-opacity": 0
        }
      });

      map.addLayer({
        id: "geojson-outline",
        type: "line",
        source: "my-geojson",
        paint: {
          "line-color": "#000000",
          "line-width": 6
        }
      });
    }

    // Add stations if data is loaded
    if (stationsData && !map.getSource('stations')) {
      map.addSource("stations", { type: "geojson", data: stationsData });

    map.addLayer({
  id: "stations-layer",
  type: "circle",
  source: "stations",
  paint: {
    // الحجم (اختياري)
    "circle-radius": [
      "case",
      ["==", ["get", "Type"], "Sample"],
      14,
      12
    ],

    // اللون
    "circle-color": [
      "case",
      ["==", ["get", "Type"], "Sample"],
      "#ff0000", // 🔴 Sample
      "#007bff"  // 🔵 Station
    ],

    "circle-stroke-color": "#000000",
    "circle-stroke-width": 1
  }
});

      if (!map.getLayer('stations-labels')) {
        // Add labels to stations
        map.addLayer({
          id: "stations-labels",
          type: "symbol",
          source: "stations",
          layout: {
            "text-field": ["get", "Name"],
            "text-size": 12,
            "text-offset": [0, 1.5],
            "text-anchor": "top"
          },
          paint: {
            "text-color": "#000000",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1
          }
        });
      }

      // Add label under S1 if applicable
      const sFeatures = stationsData.features.filter((f) => f.properties && f.properties._sym === "S" && f.geometry && f.geometry.coordinates);
  let s1LabelFeature = null;

if (sFeatures.length >= 2) {
  const lineCoords = sFeatures.map((f) => f.geometry.coordinates);
  const a = lineCoords[0];
  const b = lineCoords[1];
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

  s1LabelFeature = {
    type: "Feature",
    geometry: { type: "Point", coordinates: mid },
    properties: { label: "المحطة الأولى" }
  };
}

if (s1LabelFeature && !map.getSource("s1-station-label")) {
  map.addSource("s1-station-label", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [s1LabelFeature]
    }
  });

  map.addLayer({
    id: "s1-station-label-layer",
    type: "symbol",
    source: "s1-station-label",
    layout: {
      "text-field": ["get", "label"],
      "text-size": 10,
      "text-offset": [0, -1.5],
    },
    paint: { "text-color": "#000000" },
  });
}
} // 👈 قفلة if (stationsData && !map.getSource('stations'))

    // Add other layers
    if (!map.getSource('area')) {
      map.addSource("area", {
        type: "geojson",
        data: "/data/area.geojson"
      });
      map.addLayer({
        id: "area-fill",
        type: "fill",
        source: "area",
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.3
        }
      });
      map.addLayer({
        id: "area-outline",
        type: "line",
        source: "area",
        paint: {
          "line-color": "#ff0000",
          "line-width": 2
        }
      });
    }

    if (!map.getSource('roads')) {
      map.addSource("roads", {
        type: "geojson",
        data: "/data/roads.geojson"
      });
      map.addLayer({
        id: "roads-line",
        type: "line",
        source: "roads",
        paint: {
          "line-color": "#0000ff",
          "line-width": 3
        }
      });
    }

    if (!map.getSource('boundary')) {
      map.addSource("boundary", {
        type: "geojson",
        data: "/data/boundary.geojson"
      });
      map.addLayer({
        id: "boundary-fill",
        type: "fill",
        source: "boundary",
        paint: {
          "fill-color": "#ffd000ff",
          "fill-opacity": 0.2
        }
      });
      map.addLayer({
        id: "boundary-outline",
        type: "line",
        source: "boundary",
        paint: {
          "line-color": "#ff9100ff",
          "line-width": 2
        }
      });
    }

    // Add new points if data is provided
    if (newPointsGeoJSON && !map.getSource('new-points')) {
      map.addSource("new-points", { type: "geojson", data: newPointsGeoJSON });

      map.addLayer({
        id: "new-points-layer",
        type: "circle",
        source: "new-points",
        paint: {
          "circle-radius": 8,
          "circle-color": [
            "case",
            ["==", ["get", "Discription"], "Rock fall"],
            "#ff0000", // 🔴 Rock fall
            ["==", ["get", "Discription"], "Transition zone"],
            "#00aa00", // 🟢 Transition zone
            ["==", ["get", "Discription"], "Water channel"],
            "#0000ff", // 🔵 Water channel
            ["==", ["get", "Discription"], "Geological phenomena"],
            "#ffd700", // 🟡 Geological phenomena
            ["==", ["get", "Discription"], "اعمال الحماية القائمة"],
            "#888888", // ⚫ Protection works
            "#000000" // Default black
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2
        }
      });
    }

    // Add AllStations layer
    if (!map.getSource('all-stations')) {
      map.addSource("all-stations", {
        type: "geojson",
        data: "/data/AllStations.geojson"
      });

      map.addLayer({
        id: "all-stations-layer",
        type: "circle",
        source: "all-stations",
        paint: {
          "circle-radius": 6,
          "circle-color": [
            "case",
            ["==", ["get", "zone"], "North-East"],
            "#00ff00", // 🟢 North-East
            ["==", ["get", "zone"], "South-West"],
            "#ff00ff", // 🟣 South-West
            ["==", ["get", "zone"], "Central"],
            "#00ffff", // 🔵 Central
            "#ffa500" // 🟠 Default orange
          ],
          "circle-stroke-color": "#000000",
          "circle-stroke-width": 1,
          "circle-opacity": 0.8
        }
      });

      // Add labels for all stations
      map.addLayer({
        id: "all-stations-labels",
        type: "symbol",
        source: "all-stations",
        layout: {
          "text-field": ["get", "StationNam"],
          "text-size": 10,
          "text-offset": [0, 1.2],
          "text-anchor": "top"
        },
        paint: {
          "text-color": "#000000",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1
        }
      });
    }
  };

const bindStationPopupEvents = (map, newPointsGeoJSON = null) => {
  if (!map || !map.getLayer("stations-layer")) return;

  let currentPopup = null;

  const onClick = (e) => {
    if (!e.features || !e.features.length) return;

    const feature = e.features[0];
    const coords = feature.geometry.coordinates;
    const props = feature.properties || {};

    const name = props.Name ? String(props.Name).trim() : null;
    const id = props.OBJECTID || props.id || "unknown";

    const candidates = [];

    if (name === "Samples" || props._sym === "Samples") {
      const idx = props._sampleIndex || null;
      if (idx) {
        ["jpeg", "jpg", "png"].forEach(ext =>
          candidates.push(`/data/images/samples/sample${idx}.${ext}`)
        );
      }
    } else if (name) {
      const safe = name.replace(/\s+/g, "_");
      [safe, safe.toLowerCase()].forEach(n => {
        ["jpeg", "jpg", "png"].forEach(ext =>
          candidates.push(`/data/images/samples/${n}.${ext}`)
        );
      });
    }

    const first = candidates[0];

    const html = `
      <div style="min-width:280px">
        <strong>${props.Name || "-"}</strong>
        <br/>
        <img src="${first}" style="width:100%;margin-top:8px"
          onerror="this.style.display='none'" />
      </div>
    `;

    new maplibregl.Popup({ closeButton: true })
      .setLngLat(coords)
      .setHTML(html)
      .addTo(map);
  };

  map.on("click", "stations-layer", onClick);

  map.on("mouseenter", "stations-layer", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "stations-layer", () => {
    map.getCanvas().style.cursor = "";
  });

  // For new points
  if (newPointsGeoJSON) {
    const onNewPointClick = (e) => {
      if (!e.features || !e.features.length) return;

      const feature = e.features[0];
      const coords = feature.geometry.coordinates;
      const props = feature.properties || {};

      const code = props.Code;
      const description = props.Discription;
      const date = props.Date;

      // Find image based on Code
      let candidates = [];
      if (code) {
        // If code already includes extension, use it directly
        if (code.includes('.')) {
          candidates.push(`/data/images/samples/${code}`);
        } else {
          // Otherwise, try different extensions
          ["jpeg", "jpg", "png"].forEach(ext =>
            candidates.push(`/data/images/samples/${code}.${ext}`)
          );
        }
      }

      const first = candidates[0];

      const html = `
        <div style="min-width:320px; max-width:400px;">
          <strong>${description || "-"}</strong><br/>
          Code: ${code}<br/>
          Date: ${date}<br/>
          <img src="${first}" style="width:100%; max-width:350px; height:auto; margin-top:8px; cursor:pointer; border-radius:4px;"
            onerror="this.style.display='none'"
            onclick="window.open(this.src, '_blank')" />
        </div>
      `;

      new maplibregl.Popup({ closeButton: true })
        .setLngLat(coords)
        .setHTML(html)
        .addTo(map);
    };

    map.on("click", "new-points-layer", onNewPointClick);

    const onNewPointHover = (e) => {
      if (currentPopup) currentPopup.remove();

      if (!e.features || !e.features.length) return;

      const feature = e.features[0];
      const coords = feature.geometry.coordinates;
      const props = feature.properties || {};

      const code = props.Code;
      const description = props.Discription;
      const date = props.Date;

      // Find image based on Code
      let candidates = [];
      if (code) {
        // If code already includes extension, use it directly
        if (code.includes('.')) {
          candidates.push(`/data/images/samples/${code}`);
        } else {
          // Otherwise, try different extensions
          ["jpeg", "jpg", "png"].forEach(ext =>
            candidates.push(`/data/images/samples/${code}.${ext}`)
          );
        }
      }

      const first = candidates[0];

      const html = `
        <div style="min-width:280px">
          <strong>${description || "-"}</strong><br/>
          Code: ${code}<br/>
          Date: ${date}<br/>
          <img src="${first}" style="width:100%;margin-top:8px;max-height:200px;object-fit:cover"
            onerror="this.style.display='none'" />
        </div>
      `;

      currentPopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false })
        .setLngLat(coords)
        .setHTML(html)
        .addTo(map);
    };

    const onNewPointLeave = () => {
      if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
      }
    };

    map.on("mouseenter", "new-points-layer", onNewPointHover);
    map.on("mouseleave", "new-points-layer", onNewPointLeave);
  }

  // Bind popup events for all-stations-layer
  if (map.getLayer("all-stations-layer")) {
    const onAllStationsClick = (e) => {
      if (!e.features || !e.features.length) return;

      const feature = e.features[0];
      const coords = feature.geometry.coordinates;
      const props = feature.properties || {};

      const html = `
        <div style="min-width:200px; padding: 8px;">
          <strong style="font-size: 14px;">${props.StationNam || "-"}</strong><br/>
          <hr style="margin: 6px 0;"/>
          <b>Zone:</b> ${props.zone || "-"}<br/>
          <b>Weight:</b> ${props.weight ? props.weight.toFixed(4) : "-"}<br/>
          <b>Priority:</b> ${props.priority ? props.priority.toFixed(4) : "-"}<br/>
          <b>Pair Number:</b> ${props.PairNum || "-"}<br/>
          <b>Coordinates:</b><br/>
          X: ${props.X ? props.X.toFixed(6) : "-"}<br/>
          Y: ${props.Y ? props.Y.toFixed(6) : "-"}
        </div>
      `;

      new maplibregl.Popup({ closeButton: true })
        .setLngLat(coords)
        .setHTML(html)
        .addTo(map);
    };

    map.on("click", "all-stations-layer", onAllStationsClick);

    map.on("mouseenter", "all-stations-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "all-stations-layer", () => {
      map.getCanvas().style.cursor = "";
    });
  }
};


useEffect(() => {
  if (mapRef.current) return; // 👈 امنع إعادة الإنشاء

  const map = new maplibregl.Map({
    container: mapContainer.current,
    style: baseMapStyles[baseMap],
    center: [39.9422281607, 21.4310162095],
    zoom: 12,
    pitch: 75,
    bearing: -45,
    antialias: true,
  });

  mapRef.current = map;

  map.once("load", () => {
    Promise.all([
      fetch("/data/stations.geojson").then(r => r.json()),
      fetch("/data/مشروعالشعائرال_FeaturesToJSO.geojson").then(r => r.json()).catch(() => null)
    ])
      .then(([stationsData, newPointsData]) => {
        stationsDataRef.current = stationsData;
        setStationsData(stationsData);
        setNewPointsData(newPointsData);

        // Use the GeoJSON directly, filter out features with null geometry, and add icon property
        const geoJSON = newPointsData ? {
          ...newPointsData,
          features: newPointsData.features
            .filter(f => f.geometry && f.geometry.coordinates)
            .map(f => ({
              ...f,
              properties: {
                ...f.properties,
                icon: f.properties.Code ? `/data/images/samples/${f.properties.Code}` : null
              }
            }))
        } : null;
        setNewPointsGeoJSON(geoJSON);

        addLayersToMap(map, baseMap, geoJSON);
        bindStationPopupEvents(map, geoJSON);
      });
  });

  return () => {
    map.remove(); // ✅ cleanup
    mapRef.current = null;
  };
}, []);



useImperativeHandle(ref, () => ({
  zoomToFeatureByName(name) {
    const map = mapRef.current;
    const data = stationsDataRef.current;

    if (!map || !data || !name) return;

    const feature = data.features.find(
      (f) => f?.properties?.Name === name
    );

    if (feature?.geometry?.coordinates) {
      map.flyTo({
        center: feature.geometry.coordinates,
        zoom: 18,
        duration: 1500,
        essential: true
      });
    }
  },

  fitToAll() {
    const map = mapRef.current;
    const data = stationsDataRef.current;

    if (!map || !data?.features?.length) return;

    const coords = data.features
      .map((f) => f?.geometry?.coordinates)
      .filter(Boolean);

    if (!coords.length) return;

    const lons = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);

    map.fitBounds(
      [
        [Math.min(...lons), Math.min(...lats)],
        [Math.max(...lons), Math.max(...lats)]
      ],
      { padding: 40, duration: 1200 }
    );
  }
}));




  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", height: "40%", position: "relative" }}>

<button
  onClick={() => setLegendOpen(prev => !prev)}
  style={{
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    border: 'none',
    borderRadius: 8,
    padding: '6px 10px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
  }}
>
  ☰
</button>


        <div
          ref={mapContainer}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            zIndex: 1,
          }}
        />
        {/* <div style={{ width: "20%", padding: "2px", backgroundColor: theme === 'dark' ? 'rgba(20,25,30,0.95)' : '#f0f0f0', color: theme === 'dark' ? '#fff' : '#000' }}>
          <h4>Legend</h4>
          <div><span style={{ color: '#007bff', fontSize: '20px' }}>●</span> S</div>
          <div><span style={{ color: '#ffd700', fontSize: '20px' }}>●</span> n</div>
          <div><span style={{ color: '#ff0000', fontSize: '20px' }}>●</span> Samples</div>
          <div><span style={{ color: '#888888', fontSize: '20px' }}>●</span> Critical</div>
          <div><span style={{ color: '#00aa00', fontSize: '20px' }}>●</span> Transitional</div>
          <h4>Layers</h4>
          <label><input type="checkbox" checked={layersVisibility?.area} onChange={() => toggleLayer('area')} /> Area</label><br/>
          <label><input type="checkbox" checked={layersVisibility?.roads} onChange={() => toggleLayer('roads')} /> Roads</label><br/>
          <label><input type="checkbox" checked={layersVisibility?.boundary} onChange={() => toggleLayer('boundary')} /> Boundary</label>
        </div> */}
{legendOpen && (
  <div
    style={{
      position: 'absolute',
      top: 15,
      right: 12,
      width: 220,
      padding: 12,
      zIndex: 9,
      backgroundColor: theme === 'dark'
        ? 'rgba(20,25,30,0.95)'
        : '#f7f7f7',
      color: theme === 'dark' ? '#fff' : '#000',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}
  >
    <h6 style={{ marginTop: 0 }}>Legend</h6>

    <div style={{ fontWeight: 600, marginBottom: 6 }}>Points</div>
    <div><span style={{ color: '#007bff' }}>●</span> S</div>
    <div><span style={{ color: '#ffd700' }}>●</span> n</div>
    <div><span style={{ color: '#ff0000' }}>●</span> Samples</div>
    <div><span style={{ color: '#888888' }}>●</span> Critical</div>
    <div><span style={{ color: '#00aa00' }}>●</span> Transitional</div>

  
    <hr style={{ margin: '8px 0' }} />

    {/* DEM Layer - Only visible when Dark base map is selected */}
    {baseMap === 'dark' && (
      <div style={{ marginBottom: 6 }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer'
          }}
        >
          <input
            type="checkbox"
            checked={layersVisibility.hillshade}
            onChange={() => toggleLayer('hillshade')}
            style={{
              accentColor: theme === 'dark' ? '#4da3ff' : '#007bff',
              cursor: 'pointer'
            }}
          />
          DEM
        </label>
      </div>
    )}

    <div style={{ fontWeight: 600, marginBottom: 6 }}>Layers</div>
    {[
      { key: 'area', label: 'Area' },
      { key: 'roads', label: 'Roads' },
      { key: 'boundary', label: 'Boundary' },
    ].map(l => (
      <label
        key={l.key}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
          cursor: 'pointer'
        }}
      >
        <input
          type="checkbox"
          checked={layersVisibility[l.key]}
          onChange={() => toggleLayer(l.key)}
          style={{
            accentColor: theme === 'dark' ? '#4da3ff' : '#007bff',
            cursor: 'pointer'
          }}
        />
        {l.label}
      </label>
    ))}
  </div>
)}

{/* Base Map Selection - Separate from legend */}
<div
  style={{
    position: 'absolute',
    top: 15,
    left: 12,
    width: 200,
    padding: 12,
    zIndex: 9,
    backgroundColor: theme === 'dark'
      ? 'rgba(20,25,30,0.95)'
      : '#f7f7f7',
    color: theme === 'dark' ? '#fff' : '#000',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  }}
>
  {/* Base Map Options:
     - default: 🗺️ Standard map style
     - dark: 🌙 Dark theme map
     - imagery: 🛰️ Satellite imagery
  */}
  <div style={{ fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
    🗺️ Base Map
  </div>
  <select
    value={baseMap}
    onChange={(e) => changeBaseMap(e.target.value)}
    style={{
      width: '100%',
      padding: '4px',
      borderRadius: '4px',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
      border: '1px solid #ccc'
    }}
  >
    <option value="default">🗺️ Default</option>
    <option value="dark">🌙 Dark</option>
    <option value="imagery">🛰️ Imagery</option>
  </select>
</div>


      </div>

  

      <div style={{ height: "60%" }}>
        <ChartsSection theme={theme} />
      </div>
    </div>
  );
});

export default MapView;
