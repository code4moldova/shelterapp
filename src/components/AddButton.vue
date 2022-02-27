<script lang="ts" setup>
import { ref, watch } from "vue";
import OfferIcon from "./icons/OfferIcon.vue";
import NeedIcon from "./icons/NeedIcon.vue";
import AddIcon from "../icons/AddIcon.vue";
import Dialog from "./Dialog.vue";
import DoneIcon from "../icons/DoneIcon.vue";
import { useMapContext } from "../plugins/map-context";

const { activePointLayer: confirmLocation, mapCenter } = useMapContext();
const showModal = ref(false);
const location = ref();

const reverseUrl = (lat: number, lon: number) =>
	`https://api.iharta.md/shelters/rgeocode/?lat=${lat}&lon=${lon}&access_token=Thvoq61MGiUlBO9B03S7s0HTV1W11t7PB`;

function startOfferCreation() {
	showModal.value = true;
	confirmLocation.value = false;
	const [lat, lon] = mapCenter.value ?? [];
	// fetch(reverseUrl(lat, lon));
}
</script>

<template>
	<button
		v-if="!confirmLocation"
		@click="confirmLocation = true"
		class="fixed bg-blue-500 rounded-full bottom-10 right-10 p-2"
	>
		<AddIcon class="w-10 h-10 text-yellow-400" />
	</button>
	<button
		v-if="confirmLocation"
		@click="startOfferCreation"
		class="fixed bg-blue-500 rounded-full bottom-10 right-10 p-2"
	>
		<DoneIcon class="w-10 h-10 text-yellow-400" />
	</button>

	<Dialog v-model="showModal" title="Offer type">
		<div class="mt-3 flex justify-center gap-3">
			<button class="text-center">
				<div class="rounded bg-blue-500 px-8 md:px-12 py-5 md:py-8">
					<OfferIcon class="h-10 w-10 text-yellow-400" />
				</div>
				<span class="text-md md:text-xl">Предлагаю</span>
			</button>

			<button class="text-center">
				<div class="rounded bg-yellow-400 px-8 md:px-12 py-5 md:py-8">
					<NeedIcon class="h-10 w-10 text-blue-500" />
				</div>
				<span class="text-md md:text-xl">Ишу</span>
			</button>
		</div>
	</Dialog>
</template>
