<template>
	<div class="h-full relative rounded overflow-hidden" ref="mapWrapperRef">
		<div ref="mapRef" class="h-full" />
		<div ref="overlayRef">
			<div
				v-if="popupInfo"
				class="bg-white px-3 py-2 shadow-lg rounded-lg relative min-w-40"
			>
				<p class="flex justify-between gap-3 mb-1 text-lg font-semibold">
					<span>Інформація</span>
					<button @click="closePopup" class="text-red-500">&times;</button>
				</p>
				<p class="flex gap-2 items-center text-gray-600">
					<LocationMarkerIcon class="w-5 h-5 inline" />
					<span>{{ popupInfo.state }}, {{ popupInfo.municipality }}</span>
				</p>
				<ul>
					<li
						v-for="poi in popupInfo.pois"
						class="flex gap-2 items-center text-gray-600"
					>
						<OfficeBuildingIcon class="w-5 h-5 inline" />
						<span>{{ poi.name_ru || poi.name_ro }}</span>
					</li>
				</ul>
			</div>
		</div>
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
		<div class="absolute top-1 left-1">
			<MapSelect
				label="Маршрут передвижения"
				v-model="selectedRoad"
				:options="roads"
			/>
			<div
				v-if="selectedRoad"
				class="mt-1 text-xs w-56 bg-white rounded-lg border-2 p-2 border-blue-500"
			>
				{{ selectedRoad.info }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Map as OlMap, Feature, Geolocation, Overlay } from "ol";
import { Point } from "ol/geom";
import * as proj from "ol/proj";
import { onMounted, ref, watch } from "vue";
import AddIcon from "../../icons/AddIcon.vue";
import RemoveIcon from "../../icons/RemoveIcon.vue";
import HomeIcon from "../../icons/HomeIcon.vue";
import GpsFixedIcon from "../../icons/GpsFixedIcon.vue";
import StraightenIcon from "../../icons/StraightenIcon.vue";
import PolylineIcon from "../../icons/PolylineIcon.vue";
import LayersIcon from "../../icons/LayersIcon.vue";
import ViewListIcon from "../../icons/ViewListIcon.vue";
import FullscreenIcon from "../../icons/FullscreenIcon.vue";
import MapButton from "../MapButton.vue";
import SmallMapButton from "../SmallMapButton.vue";
import { useMapContext } from "../../plugins/map-context";
import { boundingExtent } from "ol/extent";
import MapSelect from "../MapSelect.vue";
import { useRoads } from "./use-roads";
import { usePoi } from "./use-poi";
import { centerPointLayer, myLocationLayer, tileLayer, view } from "./layers";
import { LocationMarkerIcon, OfficeBuildingIcon } from "@heroicons/vue/solid";
import { Poi } from "../types";

// TODO: Add proj4 for the rulers
// proj4.defs(
// 	"EPSG:4026",
// 	"+proj=tmerc +lat_0=0 +lon_0=28.4 +k=0.9999400000000001 +x_0=200000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
// );
// olProj4.register(proj4);

const { activePointLayer, mapCenter } = useMapContext();
const { roads, selectedRoad, roadsLayer } = useRoads();
const { poiClusterLayer } = usePoi();
let olMap: OlMap;
const showRulerSubmenu = ref(false);
const showPolygonSubmenu = ref(false);
const mapRef = ref<HTMLElement>();
const overlayRef = ref<HTMLElement>();
const mapWrapperRef = ref<HTMLElement>();
const popupInfo = ref<Poi>();

watch(activePointLayer, () =>
	centerPointLayer.setVisible(activePointLayer.value),
);

const popupOverlay = new Overlay({
	autoPan: {
		animation: {
			duration: 250,
		},
	},
});

onMounted(() => {
	if (!mapRef.value) return;

	popupOverlay.setElement(overlayRef.value);

	olMap = new OlMap({
		target: mapRef.value,
		// Removes all default controls
		controls: [],
		view,
		overlays: [popupOverlay],
		layers: [
			tileLayer,
			roadsLayer,
			myLocationLayer,
			centerPointLayer,
			poiClusterLayer,
		],
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
		const [cluster] = await poiClusterLayer.getFeatures(e.pixel);
		if (!cluster) return;

		// Get clustered Coordinates
		const features: Feature<Point>[] = cluster.get("features");

		if (features.length < 1) return;

		// Still cluster, zoom in on click
		if (features.length > 1) {
			const points = features.map((r) => r.getGeometry()?.getCoordinates());
			const extent = boundingExtent(points as number[][]);
			olMap
				.getView()
				.fit(extent, { duration: 1000, padding: [100, 100, 100, 100] });
			return;
		}

		const feature = features[0];
		const point = feature.getGeometry();
		if (!point) return;
		popupInfo.value = feature.get("poi");
		popupOverlay.setPosition(point.getCoordinates());
	});
});

function closePopup() {
	popupOverlay.setPosition(undefined);
	popupInfo.value = undefined;
}

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
</script>
