<template>
	<div ref="mapRef" class="h-full" />
</template>

<script setup lang="ts">
import { View, Map } from "ol";
import { Tile } from "ol/layer";
import { OSM } from "ol/source";
import { onMounted, ref } from "vue";

const mapRef = ref<HTMLElement>();

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

	const map = new Map({
		target: mapRef.value,
		// Removes all default controls
		controls: [],
		layers: [layer],
		view,
	});
});
</script>
