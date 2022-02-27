<template>
	<div class="relative">
		<div ref="mapRef" class="h-full" />
		<div
			class="absolute inset-y-0 flex flex-col justify-center gap-1 left-1 items-start"
		>
			<MapButton @click="zoom(0.5)">
				<AddIcon class="w-4 h-4" />
			</MapButton>
			<MapButton @click="zoom(-0.5)">
				<RemoveIcon class="w-4 h-4" />
			</MapButton>
			<MapButton @click="goHome">
				<HomeIcon class="w-4 h-4" />
			</MapButton>
			<MapButton @click="locateMe">
				<GpsFixedIcon class="w-4 h-4" />
			</MapButton>
			<div class="flex gap-1 items-center">
				<MapButton @click="showRulerSubmenu = !showRulerSubmenu">
					<StraightenIcon class="w-4 h-4" />
				</MapButton>
				<template v-if="showRulerSubmenu">
					<SmallMapButton>m</SmallMapButton>
					<SmallMapButton>km</SmallMapButton>
				</template>
			</div>
			<div class="flex gap-1 items-center">
				<MapButton @click="showPolygonSubmenu = !showPolygonSubmenu">
					<PolylineIcon class="w-4 h-4" />
				</MapButton>
				<template v-if="showPolygonSubmenu">
					<SmallMapButton>Ar</SmallMapButton>
					<SmallMapButton>ha</SmallMapButton>
					<SmallMapButton>m<sup>2</sup></SmallMapButton>
					<SmallMapButton>km<sup>2</sup></SmallMapButton>
				</template>
			</div>

			<MapButton>
				<LayersIcon class="w-4 h-4" />
			</MapButton>
			<MapButton>
				<ViewListIcon class="w-4 h-4" />
			</MapButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { View, Map, Feature, Geolocation } from "ol";
import { Tile, Vector as LayerVector } from "ol/layer";
import { OSM, Vector as SourceVector } from "ol/source";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Icon } from "ol/style";
import {
	h,
	onMounted,
	ref,
	FunctionalComponent,
	ButtonHTMLAttributes,
} from "vue";
import AddIcon from "../icons/AddIcon.vue";
import RemoveIcon from "../icons/RemoveIcon.vue";
import HomeIcon from "../icons/HomeIcon.vue";
import GpsFixedIcon from "../icons/GpsFixedIcon.vue";
import StraightenIcon from "../icons/StraightenIcon.vue";
import PolylineIcon from "../icons/PolylineIcon.vue";
import LayersIcon from "../icons/LayersIcon.vue";
import ViewListIcon from "../icons/ViewListIcon.vue";

const showRulerSubmenu = ref(false);
const showPolygonSubmenu = ref(false);
const mapRef = ref<HTMLElement>();
let olMap: Map;

onMounted(() => {
	if (!mapRef.value) return;

	const source = new OSM();
	const layer = new Tile({ source });
	const view = new View({
		projection: "EPSG:3857",
		center: [3167475.240184986, 5952086.044611719],
		extent: [
			2437181.208848241, 5100607.633807939, 3893306.0536067626, 6903564.4554155,
		],
		zoom: 7,
		minZoom: 5,
	});

	olMap = new Map({
		target: mapRef.value,
		// Removes all default controls
		controls: [],
		layers: [layer, searchLayer],
		view,
	});
});

function zoom(delta: number) {
	const zoom = olMap.getView().getZoom();
	if (!zoom) return;
	olMap.getView().animate({ zoom: zoom + delta, duration: 150 });
}

function goHome() {
	olMap.getView().animate({
		zoom: 7,
		center: [3167475.240184986, 5952086.044611719],
		duration: 400,
	});
}

function addMeOnMap(position: number[] | undefined) {
	if (!position) return;
	const feature = new Feature({ geometry: new Point(position), type: "point" });
	searchLayer.getSource().clear();
	searchLayer.getSource().addFeature(feature);
	olMap.getView().animate({ zoom: 12, center: position, duration: 400 });
}

function locateMe() {
	const projection = olMap.getView().getProjection();
	const geolocation = new Geolocation({ projection, tracking: true });
	geolocation.once("change", () => addMeOnMap(geolocation.getPosition()));
	addMeOnMap(geolocation.getPosition());
}

const MapButton: FunctionalComponent<ButtonHTMLAttributes> = (
	props,
	{ slots },
) => {
	const classes = [
		"bg-white rounded-lg border-2 border-blue-500 text-blue-500 p-1 text-xs",
		props.class,
	];

	const newProps = {
		...props,
		class: classes,
	};

	return h("button", newProps, slots);
};

const SmallMapButton: FunctionalComponent<ButtonHTMLAttributes> = (
	props,
	{ slots },
) => {
	const classes = [
		"border-2 border-blue-500 bg-white rounded text-xs px-1",
		props.class,
	];
	const newProps = {
		...props,
		class: classes,
	};
	return h("button", newProps, slots);
};

const searchLayer = new LayerVector({
	source: new SourceVector(),
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
</script>
