<script setup lang="ts">
import { KeepAlive } from "vue";
import OfferList from "./components/OfferList.vue";
import InfoMap from "./components/InfoMap.vue";
import Header from "./components/Header.vue";
import AddButton from "./components/AddButton.vue";
import { useMediaQuery } from "@vueuse/core";
import { TabGroup, TabList, Tab, TabPanels } from "@headlessui/vue";

const isDesktop = useMediaQuery("(min-width: 1024px)");
</script>

<template>
	<div class="h-screen flex flex-col">
		<Header />

		<TabGroup>
			<TabList v-if="!isDesktop" class="flex p-1 space-x-1 bg-blue-900/20">
				<Tab
					v-for="tab in ['Мапа', 'Допомога']"
					as="template"
					:key="tab"
					v-slot="{ selected }"
				>
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

			<TabPanels
				class="flex-1 overflow-y-auto"
				:class="{ 'grid grid-cols-2': isDesktop }"
				#default="{ selectedIndex }"
			>
				<KeepAlive>
					<OfferList v-if="isDesktop || selectedIndex === 1" />
				</KeepAlive>
				<KeepAlive>
					<InfoMap v-if="isDesktop || selectedIndex === 0" />
				</KeepAlive>
			</TabPanels>
		</TabGroup>
	</div>

	<AddButton />
</template>
