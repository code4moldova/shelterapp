<script setup lang="ts">
import List from "./components/List.vue";
import InfoMap from "./components/InfoMap.vue";
import Header from "./components/Header.vue";
import AddButton from "./components/BottomLeftAddBtn.vue";
import TopTabs from "./components/TopTabs.vue";
</script>

<template>
	<div class="h-screen flex flex-col">
		<Header />

		<!-- TODO: Find a way to render a single time only -->
		<div class="lg:hidden h-full">
			<TopTabs>
				<template #map>
					<InfoMap />
				</template>
				<template #offers>
					<List />
				</template>
			</TopTabs>
		</div>

		<div class="hidden lg:grid grid-cols-2 p-4 gap-4 flex-1">
			<List />
			<InfoMap />
		</div>
	</div>
	<AddButton />
</template>
