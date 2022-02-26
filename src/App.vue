<script setup lang="ts">
import List from "./components/List.vue";
import InfoMap from "./components/InfoMap.vue";
import Header from "./components/Header.vue";
</script>

<template>
	<div class="h-screen flex flex-col">
		<Header />
		<div class="grid grid-cols-2 p-4 gap-4 flex-1">
			<List />
			<InfoMap />
		</div>
	</div>
</template>
