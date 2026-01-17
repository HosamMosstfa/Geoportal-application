import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function TerrainTest() {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [39.94, 21.43], // عدلي لو حابة
      zoom: 10,
      pitch: 70,
      bearing: -45,
      antialias: true
    });

    map.on("load", () => {
      // 🔹 Terrain source (GitHub Pages)
      map.addSource("terrain-test", {
        type: "raster-dem",
        tiles: [
          "https://toqa-ahmed-kamal.github.io/terrain-tiles/{z}/{x}/{y}.png"
        ],
        tileSize: 256,
        encoding: "mapbox",
        minzoom: 9,
        maxzoom: 12
      });

      // 🔹 Enable 3D terrain
      map.setTerrain({
        source: "terrain-test",
        exaggeration: 2.5
      });

      // 🔹 Hillshade (optional)
      map.addLayer({
        id: "terrain-hillshade",
        type: "hillshade",
        source: "terrain-test"
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh"
      }}
    />
  );
}

export default TerrainTest;
