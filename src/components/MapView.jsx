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

  const baseMapStyles = {
    default: "https://demotiles.maplibre.org/style.json",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    imagery: "https://api.maptiler.com/maps/satellite/style.json?key=oh2RuUJTGdHt3cFgDcV7", // Replace with actual API key
  };

  const [stationsData, setStationsData] = useState(null);

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
      });
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
          // radius by symbol
          "circle-radius": [
            "match",
            ["get", "_sym"],
            "S",
            18,
            "n",
            9,
            "Samples",
            14,
            "Critical",
            14,
            "Transitional",
            15,
            12,
          ],
          // color by symbol
          "circle-color": [
            "match",
            ["get", "_sym"],
            "S",
            "#007bff",
            "n",
            "#ffd700",
            "Samples",
            "#ff0000",
            "Critical",
            "#888888",
            "Transitional",
            "#00aa00",
            "#ff0000",
          ],
          "circle-stroke-color": "#000000",
          "circle-stroke-width": 1,
        },
      });

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

const [legendOpen, setLegendOpen] = useState(true);

  useEffect(() => {
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
      // 🔹 Terrain
      map.addSource("terrain", {
        type: "raster-dem",
        tiles: [
          "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        encoding: "terrarium",
        maxzoom: 11
      });

      map.setTerrain({
        source: "terrain",
        exaggeration: 1.5
      });

      map.addLayer({
        id: "hillshade",
        type: "hillshade",
        source: "terrain"
      });

      // 🔹 Polygon GeoJSON
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

      // 🔹 Stations: fetch, add symbology property, then add source+layer
      fetch("/data/stations.geojson")
        .then((r) => r.json())
        .then((data) => {
          // derive simple symbol category based on Type and Name
          let sampleCounter = 1;
          data.features.forEach((f) => {
            const type = f.properties && String(f.properties.Type || "");
            const name = f.properties && String(f.properties.Name || "");
            let sym = "other";
            if (type === "Sample") {
              sym = "Samples";
              // assign sequential sample index so we can map to sample1.jpeg, sample2.jpeg, ...
              f.properties = { ...f.properties, _sym: sym, _sampleIndex: sampleCounter };
              sampleCounter += 1;
            } else {
              if (name === "Critical") sym = "Critical";
              else if (name === "Transitional") sym = "Transitional";
              else if (/s/i.test(name) && name.toLowerCase() !== "samples") sym = "S";
              else if (/^n/i.test(name)) sym = "n";
              f.properties = { ...f.properties, _sym: sym };
            }
          });

          stationsDataRef.current = data;
          setStationsData(data);

          // Update station maps count
          const criticalCount = data.features.filter(f => f.properties && f.properties._sym === 'Critical').length;
          const transitionalCount = data.features.filter(f => f.properties && f.properties._sym === 'Transitional').length;
          setChartData(prev => ({ ...prev, stationMaps: [
            { name: 'Critical', value: criticalCount },
            { name: 'Transitional', value: transitionalCount },
          ] }));

          map.addSource("stations", { type: "geojson", data });

          map.addLayer({
            id: "stations-layer",
            type: "circle",
            source: "stations",
            paint: {
              // radius by symbol
              "circle-radius": [
                "match",
                ["get", "_sym"],
                "S",
                18,
                "n",
                9,
                "Samples",
                14,
                "Critical",
                14,
                "Transitional",
                15,
                12,
              ],
              // color by symbol
              "circle-color": [
                "match",
                ["get", "_sym"],
                "S",
                "#007bff",
                "n",
                "#ffd700",
                "Samples",
                "#ff0000",
                "Critical",
                "#888888",
                "Transitional",
                "#00aa00",
                "#ff0000",
              ],
              "circle-stroke-color": "#000000",
              "circle-stroke-width": 1,
            },
          });

          // Add new layers
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

          // Add label under S1
          const s1LabelFeature = {
            type: "Feature",
            geometry: { type: "Point", coordinates: mid },
            properties: { label: "المحطة الأولى" }
          };
          map.addSource("s1-station-label", { type: "geojson", data: { type: "FeatureCollection", features: [s1LabelFeature] } });
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
        })
        .catch(() => {
          stationsDataRef.current = null;
          // fallback: add empty source so UI doesn't break
          map.addSource("stations", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "stations-layer",
            type: "circle",
            source: "stations",
            paint: { "circle-radius": 10, "circle-color": "#ff0000", "circle-stroke-color": "#000000", "circle-stroke-width": 1 },
          });
        });

      // 🔹 Popup + interactions
      map.on("click", "stations-layer", (e) => {
        const feature = e.features[0];
        const coords = feature.geometry.coordinates;
        const props = feature.properties || {};

        // Try to show image named after the point Name (user placed files in public/data/images/samples/)
        const name = (props.Name && String(props.Name).trim()) || null;
        const id = props.OBJECTID || props.id || "unknown";

        // build candidate paths based on actual filenames user has (sample1.jpeg, Critical.jpeg, Transitional.jpeg)
        const candidates = [];
        if (name === "Samples" || props._sym === "Samples") {
          // use the sequential sample index assigned earlier
          const idx = props._sampleIndex || props._sampleIdx || null;
          if (idx) {
            candidates.push(`/data/images/samples/sample${idx}.jpeg`);
            candidates.push(`/data/images/samples/sample${idx}.jpg`);
            candidates.push(`/data/images/samples/sample${idx}.png`);
          }
          // also try generic "Samples" filename
          candidates.push(`/data/images/samples/Samples.jpeg`);
          candidates.push(`/data/images/samples/Samples.jpg`);
        } else if (name) {
          // try exact name filenames like Critical.jpeg or Transitional.jpeg
          const safe = name.replace(/\s+/g, "_");
          candidates.push(`/data/images/samples/${safe}.jpeg`);
          candidates.push(`/data/images/samples/${safe}.jpg`);
          candidates.push(`/data/images/samples/${safe}.png`);
          const lower = safe.toLowerCase();
          if (lower !== safe) {
            candidates.push(`/data/images/samples/${lower}.jpeg`);
            candidates.push(`/data/images/samples/${lower}.jpg`);
            candidates.push(`/data/images/samples/${lower}.png`);
          }
        }
        // fallback patterns by id
        candidates.push(`/data/images/samples/samples_${id}.jpg`);
        candidates.push(`/data/images/samples/samples_${id}.jpeg`);
        candidates.push(`/data/images/samples/critical_${id}.jpg`);
        candidates.push(`/data/images/samples/transitional_${id}.jpg`);

        // inline onerror chain: try next candidate, hide image if none left
        const first = candidates[0];
        const rest = candidates.slice(1);
        let onerrorScript = "";
        if (rest.length > 0) {
          // build nested onerror that cycles through rest
          // example: this.onerror=null;this.src='next';this.onerror=function(){...}
          let nested = "this.style.display='none';";
          for (let i = rest.length - 1; i >= 0; i--) {
            const src = rest[i].replace(/"/g, '\\"');
            nested = `this.onerror=null;this.src=\"${src}\";this.onerror=function(){${nested}};`;
          }
          onerrorScript = nested;
        } else {
          onerrorScript = "this.style.display='none';";
        }

        const html = `
          <div style="min-width:300px;max-width:500px;font-family:Arial, Helvetica, sans-serif;color:#111">
            <div style="display:flex;gap:10px;align-items:flex-start">
              <img src="${first}" alt="img-${id}" style="width:400px;height:250px;border-radius:6px;object-fit:cover;box-shadow:0 2px 6px rgba(0,0,0,0.2)" onerror="${onerrorScript}" />
              <div style="flex:1">
                <div style="font-weight:700;font-size:18px;margin-bottom:6px">${props.Name || "-"}</div>
                <div style="font-size:16px;color:#444;margin-bottom:4px">معرف: <span style="font-weight:600">${props.OBJECTID || "-"}</span></div>
                <div style="font-size:16px;color:#444">الفئة: <span style="font-weight:600">${props._sym || props.Name || "-"}</span></div>
              </div>
            </div>
            <div style="margin-top:8px;font-size:14px;color:#666;border-top:1px solid #eee;padding-top:8px">اضغط خارج البوب للإغلاق</div>
          </div>
        `;
new maplibregl.Popup({
  className: 'custom-popup',
  maxWidth: '1120px',   // 👈 هنا تتحكمّي في العرض
  closeButton: true
})
.setLngLat(coords)
.setHTML(html)
.addTo(map);

      });

      map.on("mouseenter", "stations-layer", () => {
        map.getCanvas().style.cursor = "pointer";
        map.dragPan.disable();
      });

      map.on("mouseleave", "stations-layer", () => {
        map.getCanvas().style.cursor = "";
        map.dragPan.enable();
      });
    });

    return () => map.remove();
  }, []);

  useImperativeHandle(ref, () => ({
    zoomToFeatureByName(name) {
      const map = mapRef.current;
      const data = stationsDataRef.current;
      if (!map || !data) return;

      const feature = data.features.find(
        (f) => f.properties && String(f.properties.Name) === String(name)
      );
      if (feature && feature.geometry && feature.geometry.coordinates) {
        map.flyTo({ center: feature.geometry.coordinates, zoom: 16 });
      }
    },
    fitToAll() {
      const map = mapRef.current;
      const data = stationsDataRef.current;
      if (!map || !data || !data.features || data.features.length === 0) return;

      const coords = data.features
        .map((f) => f.geometry && f.geometry.coordinates)
        .filter(Boolean);
      const lons = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      map.fitBounds([
        [minLon, minLat],
        [maxLon, maxLat],
      ], { padding: 40 });
    },
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
          <BarChart data={chartData.rockMassClassification} title="تصنيف الكتل الصخريه" theme={theme} />
          <BarChart data={chartData.hazardPercentages} title="مسح المخاطر السقوط الصخري (%)" theme={theme} />
          <BarChart data={chartData.stationMaps} title="عدد الخرائط الجغرافية للنقاط الحرجة والانتقالية" theme={theme} />
        </div>
      </div>
    </div>
  );
});

export default MapView;
