<template>
	<div class="mt-3 flex justify-center gap-3">
		<button class="text-center" @click="$emit('type', OfferType.offer)">
			<div class="rounded bg-blue-500 px-8 md:px-12 py-5 md:py-8">
				<OfferIcon class="h-10 w-10 text-yellow-400" />
			</div>
			<span class="text-md md:text-xl">Предлагаю</span>
		</button>

		<button class="text-center" @click="$emit('type', OfferType.search)">
			<div class="rounded bg-yellow-400 px-8 md:px-12 py-5 md:py-8">
				<NeedIcon class="h-10 w-10 text-blue-500" />
			</div>
			<span class="text-md md:text-xl">Ишу</span>
		</button>
	</div>
</template>

<script lang="ts" setup>
import OfferIcon from "../icons/OfferIcon.vue";
import NeedIcon from "../icons/NeedIcon.vue";
import { OfferType } from "./use-filters";
defineEmits(["type"]);
</script>
