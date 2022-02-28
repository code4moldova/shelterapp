<template>
	<div
		class="h-full lg:h-auto lg:aspect-square relative rounded overflow-hidden"
		ref="mapWrapperRef"
	>
		<div ref="mapRef" class="h-full" />
		<img
			v-if="activePointLayer"
			class="absolute w-10 drop-shadow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[17px]"
			src="/map-pin.png"
			alt=""
		/>
		<MapButton class="absolute top-1 right-1" @click="requestFullScreen">
			<FullscreenIcon class="w-4 h-4" />
		</MapButton>
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
import { View, Map as OlMap, Feature, Geolocation } from "ol";
import { Tile, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource, Cluster } from "ol/source";
import { Geometry, Point } from "ol/geom";
import { GeoJSON } from "ol/format";
import { Style, Fill, Stroke, Icon, Circle, Text } from "ol/style";
import * as proj from "ol/proj";
import { onMounted, ref, watch } from "vue";
import AddIcon from "../icons/AddIcon.vue";
import RemoveIcon from "../icons/RemoveIcon.vue";
import HomeIcon from "../icons/HomeIcon.vue";
import GpsFixedIcon from "../icons/GpsFixedIcon.vue";
import StraightenIcon from "../icons/StraightenIcon.vue";
import PolylineIcon from "../icons/PolylineIcon.vue";
import LayersIcon from "../icons/LayersIcon.vue";
import ViewListIcon from "../icons/ViewListIcon.vue";
import FullscreenIcon from "../icons/FullscreenIcon.vue";
import MapButton from "./MapButton.vue";
import SmallMapButton from "./SmallMapButton.vue";
import { useMapContext } from "../plugins/map-context";
import { boundingExtent } from "ol/extent";

// TODO: Add proj4 for the rulers
// proj4.defs(
// 	"EPSG:4026",
// 	"+proj=tmerc +lat_0=0 +lon_0=28.4 +k=0.9999400000000001 +x_0=200000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
// );
// olProj4.register(proj4);

const { activePointLayer, mapCenter } = useMapContext();

const showRulerSubmenu = ref(false);
const showPolygonSubmenu = ref(false);

const mapRef = ref<HTMLElement>();
const mapWrapperRef = ref<HTMLElement>();
let olMap: OlMap;

const centerPointLayer = new VectorLayer({
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

watch(activePointLayer, () =>
	centerPointLayer.setVisible(activePointLayer.value),
);

const view = new View({
	projection: "EPSG:3857",
	center: [3167475.240184986, 5952086.044611719],
	extent: [
		2437181.208848241, 5100607.633807939, 3893306.0536067626, 6903564.4554155,
	],
	zoom: 7,
	minZoom: 5,
});

const raioane = new Map([
	["Basarabeasca", [3216631.066025944892317, 5842206.573392572812736]],
	["Briceni", [3003072.019361425191164, 6156158.381598853506148]],
	["Cahul", [3149123.568401432596147, 5756003.178547497838736]],
	["Cantemir", [3154183.877697867807001, 5819690.453469815663993]],
	["Drochia", [3101128.654624546412379, 6113020.887209438718855]],
	["Fălești", [3085751.483528479933739, 6035980.156098236329854]],
	["Bălți", [3109289.423339795786887, 6069351.464633577503264]],
	["Ocnița", [3064342.691434606444091, 6168786.085330496542156]],
	["Călărași", [3151002.523615576792508, 5991243.450291478075087]],
	["Căușeni", [3264341.481000471394509, 5884987.388167560100555]],
	["Dondușeni", [3080120.53718033619225, 6146908.899017876014113]],
	["Edineț", [3036496.06201200094074, 6129069.390442192554474]],
	["Dubăsari", [3240016.658753918018192, 5992697.294528198428452]],
	["Sîngerei", [3130120.88644335931167, 6050739.085065165534616]],
	["Chișinău", [3213961.392071668524295, 5944839.934291531331837]],
	["Criuleni", [3230978.204669487196952, 5967970.684981465339661]],
	["Strășeni", [3177325.746584933716804, 5968589.638338066637516]],
	["Șoldănești", [3193011.031814167276025, 6079448.005475859157741]],
	["Ștefan Vodă", [3308091.546661886386573, 5861432.991926955059171]],
	["UAT Stânga Nistrului", [3282267.55632487218827, 5945565.000200471840799]],
	["Florești", [3157612.19017068343237, 6089039.294193187728524]],
	["Anenii Noi", [3253552.609487248584628, 5927122.900560673326254]],
	["UTA Găgăuzia", [3196137.767667891457677, 5809870.544556598179042]],
	["Glodeni", [3062109.170190459582955, 6063747.514527728781104]],
	["Hîncești", [3162213.754862977657467, 5915659.607984576374292]],
	["Ialoveni", [3208479.331406533718109, 5917124.305006320588291]],
	["Leova", [3162801.682627548929304, 5864414.71597158908844]],
	["Nisporeni", [3131870.744841223582625, 5956409.90888200327754]],
	["Orhei", [3205764.878391641657799, 6010150.509848369285464]],
	["Rezina", [3211989.270599716342986, 6055926.028583658859134]],
	["Rîșcani", [3060492.535810024943203, 6092997.195119884796441]],
	["Soroca", [3138588.436684388667345, 6129956.075788766145706]],
	["Taraclia", [3181429.076597475912422, 5764474.997567731887102]],
	["Ungheni", [3106480.241893899161369, 5993041.963218469172716]],
	["Telenești", [3165780.244962127413601, 6033027.254958735778928]],
	["Cimișlia", [3203368.687236454337835, 5874256.95451148878783]],
	["Bender", [3253552.609487248584628, 5927122.900560673326254]],
]);

const tileLayer = new Tile({ source: new OSM(), visible: true });
const poiSource = new VectorSource();
const clusterSource = new Cluster({
	source: poiSource,
	distance: 20,
	minDistance: 30,
	// geometryFunction: (f) => {
	// 	const coord = raioane.get(f.get("raion"));
	// 	return coord ? new Point(coord) : null;
	// },
});

const styleCache: any = {};
const clustersLayer = new VectorLayer({
	source: clusterSource,
	style: (feature) => {
		const size = feature.get("features").length;

		styleCache[size] = styleCache[size]
			? styleCache[size]
			: new Style({
					image: new Circle({
						radius: 10,
						stroke: new Stroke({ color: "#fff" }),
						fill: new Fill({ color: "#3399CC" }),
					}),
					text: new Text({
						text: size.toString(),
						fill: new Fill({ color: "#fff" }),
					}),
			  });

		return styleCache[size];
	},
});

const roadsSource = new VectorSource();
const roadsLayer = new VectorLayer({
	source: roadsSource,
	style: new Style({ stroke: new Stroke({ color: "green", width: 2 }) }),
});

onMounted(async () => {
	const response = await fetch("https://api.iharta.md/helpua/request/poi");
	type Poi = { x: number; y: number; state: string };
	const data: Array<Poi> = await response.json();

	const features = data.map((poi) => {
		const coord = proj.transform([poi.x, poi.y], "EPSG:4326", "EPSG:3857");
		const geometry = new Point(coord);
		return new Feature({ geometry, raion: poi.state });
	});

	poiSource.addFeatures(features);
});

onMounted(async () => {
	const response = await fetch("/help_roads_3857.geojson");
	const json = await response.json();
	roadsSource.addFeatures(new GeoJSON().readFeatures(json));
});

onMounted(() => {
	if (!mapRef.value) return;

	olMap = new OlMap({
		target: mapRef.value,
		// Removes all default controls
		controls: [],
		layers: [
			tileLayer,
			myLocationLayer,
			centerPointLayer,
			clustersLayer,
			roadsLayer,
		],
		view,
	});

	olMap.on("moveend", () => {
		const coords = olMap.getView().getCenter();
		if (!coords) return;

		mapCenter.value = proj.transform(
			[coords[0], coords[1]],
			"EPSG:3857",
			"EPSG:4326",
		);
		const feature = new Feature({ geometry: new Point(coords), type: "point" });
		centerPointLayer.getSource().clear();
		centerPointLayer.getSource().addFeature(feature);
	});

	olMap.on("click", async (e) => {
		const clickedFeatures = await clustersLayer.getFeatures(e.pixel);
		if (!clickedFeatures.length) return;
		// Get clustered Coordinates
		const features: Feature<Point>[] = clickedFeatures[0].get("features");
		if (features.length < 2) return;
		const points = features.map((r) => r.getGeometry()?.getCoordinates());
		const extent = boundingExtent(points as number[][]);
		olMap.getView().fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
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
	myLocationLayer.getSource().clear();
	myLocationLayer.getSource().addFeature(feature);
	olMap.getView().animate({ zoom: 12, center: position, duration: 400 });
}

function locateMe() {
	const projection = olMap.getView().getProjection();
	const geolocation = new Geolocation({ projection, tracking: true });
	geolocation.once("change", () => addMeOnMap(geolocation.getPosition()));
	addMeOnMap(geolocation.getPosition());
}

function requestFullScreen() {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		mapWrapperRef.value?.requestFullscreen();
	}
}

const myLocationLayer = new VectorLayer({
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
</script>
