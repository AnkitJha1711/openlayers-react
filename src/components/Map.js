// Map.js
import React, { useRef, useEffect, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat} from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Draw, Modify, Snap } from 'ol/interaction';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapObject = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    setMap(mapObject);

    return () => mapObject.dispose();
  }, []);

  useEffect(() => {
    if (!map) return;

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);

    const draw = new Draw({
      source: vectorSource,
      type: 'Point', // Default interaction type
    });
    map.addInteraction(draw);

    const modify = new Modify({ source: vectorSource });
    map.addInteraction(modify);

    const snap = new Snap({ source: vectorSource });
    map.addInteraction(snap);

    draw.on('drawend', (event) => {
      console.log(event.feature.getGeometry().getCoordinates());
    });

    return () => {
      map.removeLayer(vectorLayer);
      map.removeInteraction(draw);
      map.removeInteraction(modify);
      map.removeInteraction(snap);
    };
  }, [map]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
