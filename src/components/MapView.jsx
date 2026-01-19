import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { GaugeChart } from "./charts/GaugeChart";
import { BarChart } from "./charts/BarChart";
import { PieChart } from "./charts/PieChart";

const MapView = forwardRef(function MapView({ theme }, ref) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const stationsDataRef = useRef(null);
  const [chartData, setChartData] = useState({
    reconnaissanceCompletion: 75,
    rockMassClassification: [
      { name: 'RMR', value: 10 },
      { name: 'GSI', value: 20 },
      { name: 'SMR', value: 30 },
    ],
    rockfallHazard: [
      { name: 'Low', value: 40 },
      { name: 'Medium', value: 35 },
      { name: 'High', value: 25 },
    ],
    protectionWorks: 60,
    hazardPercentages: [
      { name: 'Low', value: 40 },
      { name: 'Medium', value: 35 },
      { name: 'High', value: 25 },
    ],
    stationMaps: [
      { name: 'Critical', value: 1 },
      { name: 'Transitional', value: 1 },
    ],
  });

  const [layersVisibility, setLayersVisibility] = useState({
    area: true,
    roads: true,
    boundary: true,
  });

  const [baseMap, setBaseMap] = useState('default');

  const [selectedStation, setSelectedStation] = useState('');

  const baseMapStyles = {
    default: "https://demotiles.maplibre.org/style.json",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    imagery: "https://api.maptiler.com/maps/satellite/style.json?key=oh2RuUJTGdHt3cFgDcV7", // Replace with actual API key
  };

  const [stationsData, setStationsData] = useState(null);

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
    }
  };

  const changeBaseMap = (newBaseMap) => {
    setBaseMap(newBaseMap);
    const map = mapRef.current;
    if (map) {
      map.setStyle(baseMapStyles[newBaseMap]);
      // Re-add layers after style change
      map.once('style.load', () => {
        addLayersToMap(map);
        bindStationPopupEvents(map);
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

  const addLayersToMap = (map) => {
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
  };

const bindStationPopupEvents = (map) => {
  if (!map || !map.getLayer("stations-layer")) return;

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
    fetch("/data/stations.geojson")
      .then(r => r.json())
      .then(data => {
        stationsDataRef.current = data;
        setStationsData(data);

        addLayersToMap(map);
        bindStationPopupEvents(map);
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

    <div style={{ fontWeight: 600, marginBottom: 6 }}>Base Map</div>
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
      <option value="default">Default</option>
      <option value="dark">Dark</option>
      <option value="imagery">Imagery</option>
    </select>

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


      </div>

  

      <div style={{ height: "60%", padding: "3px",  backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          <GaugeChart value={chartData.reconnaissanceCompletion} title="استكمال المسح الاستطلاعي" theme={theme} />
          <GaugeChart value={chartData.protectionWorks} title="أعمال الحماية القائمة" theme={theme} />
          <PieChart data={chartData.rockfallHazard} title="مسح المخاطر السقوط الصخري" theme={theme} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          <BarChart data={chartData.rockMassClassification} title="تصنيف الكتل الصخرية (RMR, SMR, GSI)" theme={theme} />
          <BarChart data={chartData.hazardPercentages} title="مسح مخاطر السقوط الصخري (Colorado Method)" theme={theme} />
          <BarChart data={chartData.stationMaps} title="عدد الخرائط الجغرافية للنقاط الحرجة والانتقالية" theme={theme} />
        </div>
      </div>
    </div>
  );
});

export default MapView;
