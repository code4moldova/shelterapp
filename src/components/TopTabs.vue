<template>
	<TabGroup>
		<TabList class="flex p-1 space-x-1 bg-blue-900/20">
			<Tab v-for="tab in tabs" as="template" :key="tab" v-slot="{ selected }">
				<button
					:class="[
						'w-full py-2.5 text-sm leading-5 font-medium text-blue-700',
						'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
						selected ? 'bg-white shadow' : ' hover:bg-white/[0.12]',
					]"
				>
					{{ tab }}
				</button>
			</Tab>
		</TabList>

		<TabPanels class="h-full">
			<TabPanel class="h-full">
				<slot name="map" />
			</TabPanel>
			<TabPanel class="h-full">
				<slot name="offers" />
			</TabPanel>
		</TabPanels>
	</TabGroup>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

const tabs = ["Мапа", "Допомога"];
</script>
