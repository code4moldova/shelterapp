<template>
	<header class="bg-blue-600 p-3 text-white flex gap-3 items-center relative">
		<img src="../assets/logo.png" alt="app logo" class="h-8" />
		<strong class="text-sm">Допомога Молдова – Україна</strong>

		<Button @click="open = true">
			<FilterIcon class="w-3.5 h-3.5" />
		</Button>
		<HeaderFilter :is-open="open" @close="open = false" />
	</header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import HeaderFilter from "./HeaderFilter.vue";
import Button from "./Button.vue";
import FilterIcon from "../icons/FilterIcon.vue";
export default defineComponent({
	name: "Header",
	components: {
		HeaderFilter,
		Button,
		FilterIcon,
	},
	setup() {
		const open = ref(false);

		return {
			open,
		};
	},
});
</script>
