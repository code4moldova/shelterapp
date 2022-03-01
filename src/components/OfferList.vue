<template>
	<div class="h-full overflow-y-auto">
		<div class="p-3 sticky top-0 bg-white shadow-lg border flex gap-3">
			<button
				class="bg-blue-500 px-3 py-2 rounded text-white font-semibold"
				@click="previousPage"
			>
				Previous
			</button>
			<button
				class="bg-blue-500 px-3 py-2 rounded text-white font-semibold"
				@click="nextPage"
			>
				Next
			</button>
		</div>
		<div class="bg-white shadow overflow-hidden sm:rounded-md">
			<ul role="list" class="divide-y divide-gray-200">
				<li v-for="offer in rows" :key="offer.id">
					<a href="#" class="block hover:bg-gray-50">
						<div class="px-4 py-4 sm:px-6">
							<div class="flex items-center justify-between">
								<p class="text-sm font-medium text-indigo-600 truncate">
									{{ offerCategory(offer.categories[0]) }}
								</p>
								<div class="ml-2 flex-shrink-0 flex">
									<p
										class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
									>
										{{ offer.maxNumber }}
									</p>
								</div>
							</div>
							<div class="mt-2 sm:flex sm:justify-between">
								<div class="sm:flex">
									<p class="flex items-center text-sm text-gray-500">
										<UsersIcon
											class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
											aria-hidden="true"
										/>
										{{ offer.name }}
									</p>
									<p
										class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6 truncate"
									>
										<LocationMarkerIcon
											class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
											aria-hidden="true"
										/>
										{{ offer.region }}, {{ offer.location }}
									</p>
								</div>
								<div
									class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0"
								>
									<CalendarIcon
										class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
									<p>
										<time :datetime="offer.createdDate">
											{{ new Date(offer.createdDate).toLocaleDateString() }}
										</time>
									</p>
								</div>
							</div>
						</div>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	CalendarIcon,
	LocationMarkerIcon,
	UsersIcon,
} from "@heroicons/vue/solid";

import { ref, onMounted, watch } from "vue";
import { offerCategory, OfferType } from "./use-filters";
import {
	OfferCategory,
	personsQnt,
	selectedOfferType,
	selectedOfferCategory,
	selectedOfferVariant,
} from "./use-filters";
import type { Contact } from "./types";

type Offer = {
	id: number;
	type: OfferType;
	name: string;
	region: string;
	location: string;
	categories: OfferCategory[];
	maxNumber: number;
	description?: string;
	contacts: Contact[];
	createdDate: string;
};

const offset = ref(0);
const limit = ref(20);
const total = ref(0);
const offers = ref<Offer[]>([]);
const rows = ref<Offer[]>([]);

function nextPage() {
	const next = offset.value + limit.value;
	offset.value = next >= total.value ? offset.value : next;
	doSearch(offset.value, limit.value, "id", "asc");
}
function previousPage() {
	const next = offset.value - limit.value;
	offset.value = next > 0 ? next : 0;
	doSearch(offset.value, limit.value, "id", "asc");
}

onMounted(async () => {
	const response = await fetch("https://api.iharta.md/helpua/request/shelters");
	const data = await response.json();

	// table.total = data.length;
	total.value = data.length;

	offers.value = data.map((item: any, index: number) => ({
		id: index,
		name: item.name,
		description: item.descript,
		type: item.type,
		categories: item.help_type || [],
		maxNumber: item.max_number,
		region: item.lev1,
		location: item.lev2,
		contacts: item.contacts,
		createdDate: item.created_date,
	}));

	doSearch(offset.value, limit.value, "id", "asc");
});

function sortNumbers(a: number, b: number) {
	return a - b;
}

function sortStrings(a: string, b: string) {
	let nameA = a.toUpperCase();
	let nameB = b.toUpperCase();
	return nameA.localeCompare(nameB);
}

const columnSort: Record<string, any> = {
	id: sortNumbers,
	name: sortStrings,
	region: sortStrings,
	location: sortStrings,
	description: sortStrings,
	type: sortStrings,
};

const doSearch = (
	offset: number,
	limit: number,
	order: string,
	sort: string,
) => {
	rows.value = offers.value
		// max people number
		.filter((row) => {
			if (!+row.maxNumber || !personsQnt.value) return true;
			return +row.maxNumber < personsQnt.value;
		})
		// Offer type
		.filter((row) => {
			if (!row.type || !selectedOfferType.value.id) return true;
			return +row.type === selectedOfferType.value.id;
		})
		.filter((row) => {
			if (!selectedOfferCategory.value.length) return true;
			return (
				row.categories.filter((category) =>
					selectedOfferCategory.value.includes(category),
				).length > 0
			);
		})
		.sort((a: any, b: any) => {
			const result = columnSort[order](a[order], b[order]);
			return sort == "asc" ? result : result * -1;
		})
		.slice(offset, limit + offset);
};

watch(
	[personsQnt, selectedOfferType, selectedOfferCategory, selectedOfferVariant],
	() => doSearch(0, limit.value, "id", "asc"),
);
</script>
