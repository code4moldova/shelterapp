import { View } from "ol";
import { Tile, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";

import { Style, Fill, Stroke, Icon, Circle } from "ol/style";

export const view = new View({
	projection: "EPSG:3857",
	center: [3167475.240184986, 5952086.044611719],
	extent: [
		2437181.208848241, 5100607.633807939, 3893306.0536067626, 6903564.4554155,
	],
	zoom: 7,
	minZoom: 5,
});

export const tileLayer = new Tile({ source: new OSM(), visible: true });

export const myLocationLayer = new VectorLayer({
	source: new VectorSource(),
	style: new Style({
		fill: new Fill({
			color: "rgba(41, 98, 255, 0.2)",
		}),
		stroke: new Stroke({
			color: "#2962FF",
			width: 3,
		}),
		image: new Icon({
			src: "/marker.png",
			scale: 0.34,
			anchor: [0.5, 1],
			anchorXUnits: "fraction",
			anchorYUnits: "fraction",
		}),
	}),
});

export const centerPointLayer = new VectorLayer({
	source: new VectorSource(),
	style: new Style({
		image: new Circle({
			radius: 7,
			fill: new Fill({ color: "#FF7F11" }),
			stroke: new Stroke({ color: "white", width: 1 }),
		}),
	}),
	visible: false,
});
