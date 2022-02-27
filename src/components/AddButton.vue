<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import AddIcon from "../icons/AddIcon.vue";
import Dialog from "./Dialog.vue";
import DoneIcon from "../icons/DoneIcon.vue";
import { useMapContext } from "../plugins/map-context";
import ChoseType from "./ChoseType.vue";
import CreateOffer from "./CreateOffer.vue";
import { OfferType } from "./use-filters";

const { activePointLayer: confirmLocation, mapCenter } = useMapContext();
const dialogBody = ref<OfferType>(OfferType.unknown);
const showModal = ref(false);
const locationDataLoading = ref(false);
const locationDataError = ref(false);
const locationDataLev1 = ref("");
const locationDataLev2 = ref("");

const reverseUrl = (lat: number, lon: number) =>
	`https://api.iharta.md/shelters/rgeocode/?lat=${lat}&lon=${lon}&access_token=Thvoq61MGiUlBO9B03S7s0HTV1W11t7PB`;

function startOfferCreation() {
	showModal.value = true;
	confirmLocation.value = false;
	const [lon, lat] = mapCenter.value ?? [];

	locationDataLoading.value = true;
	fetch(reverseUrl(lat, lon))
		.then((r) => r.json())
		.then((data) => {
			const lev1 = data.find((l: any) => l.docinfo.type === "lev1");
			const lev2 = data.find((l: any) => l.docinfo.type === "lev2");
			locationDataLev1.value = lev1.document.lev1.ro;
			locationDataLev2.value = lev2.document.lev2.ro;
			locationDataError.value = false;
			locationDataLoading.value = false;
		})
		.catch(() => {
			locationDataError.value = true;
			locationDataLoading.value = false;
		});
}

const dialogTitle = computed(() => {
	if (dialogBody.value === OfferType.offer) return "Создать предложение";
	if (dialogBody.value === OfferType.search) return "Поиск";
});

function closeModal(value: boolean) {
	showModal.value = value;
	dialogBody.value = OfferType.unknown;
}
</script>

<template>
	<div
		v-if="!confirmLocation"
		class="fixed bottom-5 right-5 border border-transparent p-2 rounded-full"
	>
		<button
			@click="confirmLocation = true"
			class="bg-blue-500 rounded-full p-2 shadow"
		>
			<AddIcon class="w-10 h-10 text-yellow-400" />
		</button>
	</div>
	<div
		v-if="confirmLocation"
		class="fixed bottom-5 right-5 left-5 sm:left-auto rounded-full bg-white flex justify-between items-center p-2 border shadow"
	>
		<strong class="block px-5 text-xs font-semibold truncate">
			Укажите местоположение на карте
			<br />
			Нажмите <DoneIcon class="-mt-0.5 inline w-5 h-5" /> чтобы подтвердить
		</strong>
		<button @click="startOfferCreation" class="bg-blue-500 rounded-full p-2">
			<DoneIcon class="w-10 h-10 text-yellow-400" />
		</button>
	</div>

	<Dialog
		:model-value="showModal"
		@update:model-value="closeModal"
		:title="dialogTitle"
	>
		<div v-if="locationDataLoading">Местоположение Загрузка...</div>
		<div v-else-if="locationDataError">Что-то пошло не так...</div>
		<ChoseType
			v-else-if="dialogBody === OfferType.unknown"
			class="mt-3"
			@type="dialogBody = $event"
		/>
		<CreateOffer
			v-else-if="dialogBody === OfferType.offer"
			:type="dialogBody"
			:lat="mapCenter ? mapCenter[0] : 0"
			:lon="mapCenter ? mapCenter[1] : 0"
			:lev1="locationDataLev1"
			:lev2="locationDataLev2"
		/>
		<div v-else-if="dialogBody === OfferType.search">To be added...</div>
	</Dialog>
</template>
