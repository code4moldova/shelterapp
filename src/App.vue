<script setup lang="ts">
import OfferList from "./components/OfferList.vue";
import InfoMap from "./components/InfoMap.vue";
import Header from "./components/Header.vue";
import AddButton from "./components/AddButton.vue";
import TopTabs from "./components/TopTabs.vue";
import { useMediaQuery } from "@vueuse/core";

const isDesktop = useMediaQuery("(min-width: 1024px)");
</script>

<template>
	<div class="h-screen flex flex-col">
		<Header />

		<!-- TODO: Find a way to render a single time only -->
		<!-- TODO: Move data to parent and load only if missing -->
		<TopTabs v-if="!isDesktop">
			<template #map>
				<InfoMap />
			</template>
			<template #offers>
				<OfferList />
			</template>
		</TopTabs>

		<div v-if="isDesktop" class="grid grid-cols-2 flex-1 overflow-y-auto">
			<OfferList />
			<InfoMap />
		</div>
	</div>

	<AddButton />
</template>
