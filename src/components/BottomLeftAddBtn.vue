<script lang="ts" setup>
import { ref } from "vue";
import { XIcon } from "@heroicons/vue/solid";
// Icons
import Predlagaiu from "./icons/Predlagaiu.vue";
import Ishiu from "./icons/Ishiu.vue";

let shownModal = ref<boolean>(false);
const items: [
	{ slug: string; Component: any },
	{ slug: string; Component: any },
] = [
	{ slug: "Предлагаю", Component: Predlagaiu },
	{ slug: "Ищу", Component: NeedIcon },
];
function openModal() {
	shownModal.value = true;
}

function closeModal() {
	shownModal.value = false;
}
</script>

<template>
	<span
		@click="openModal()"
		class="text-5xl text-yellow-500 fixed bg-blue-500 bottom-10 rounded-full right-10 cursor-pointer w-14 h-14 flex items-center justify-center z-20"
		>+</span
	>
	<template v-if="shownModal">
		<div
			class="h-1/4 md:h-1/3 bg-white w-11/12 md:w-2/4 absolute z-40 top-1/2 left-1/2 transform -translate-x-1/2 items-center justify-around -translate-y-1/2 flex-row flex pb-10 pl-10 pr-10"
		>
			<div
				class="block absolute right-2 top-2 cursor-pointer"
				@click="closeModal()"
			>
				<XIcon class="h-6 md:h-10 z-60" />
			</div>

			<div class="flex flex-col items-center">
				<div
					class="flex flex-col justify-between cursor-pointer items-center rounded bg-blue-500 px-8 md:px-12 py-5 md:py-8"
				>
					<Predlagaiu class="h-10 w-10" id="yellow" />
				</div>
				<span class="text-md md:text-xl">Предлагаю</span>
			</div>

			<div class="flex flex-col items-center">
				<div
					class="flex flex-col justify-between cursor-pointer items-center rounded bg-yellow-500 px-8 md:px-12 py-5 md:py-8"
				>
					<Ishiu class="h-10 w-10" id="blue" icon-color="#fff" />
				</div>
				<span class="text-md md:text-xl">Ишу</span>
			</div>
		</div>
	</template>
</template>

<style>
#blue {
	color: "blue";
}
</style>
