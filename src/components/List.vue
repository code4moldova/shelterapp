<template>
	<div class="w-full overflow-scroll">
		<TableLite
			class="overflow-scroll"
			v-bind="table"
			@is-finished="table.isLoading = false"
			@do-search="doSearch"
		/>
	</div>
</template>

<script lang="ts">
import { PhoneIcon, MailIcon } from "@heroicons/vue/solid";
import IconFB from "../icons/IconFB.vue";
import { ref, onMounted, reactive, watch } from "vue";
import type { OfferType } from "./use-filters";
import {
	OfferCategory,
	personsQnt,
	selectedOfferType,
	selectedOfferCategory,
	selectedOfferVariant,
} from "./use-filters";
import TableLite from "vue3-table-lite/ts"; // TypeScript
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
};

export default {
	name: "OfferList",
	components: {
		IconFB,
		PhoneIcon,
		MailIcon,
		TableLite,
	},
	setup() {
		const SHELTERS_ENDPOINT = "https://api.iharta.md/helpua/request/shelters";

		const table = reactive({
			isLoading: false,
			isReSearch: false,
			columns: [
				{
					label: "id",
					field: "id",
					width: "3%",
					sortable: true,
					isKey: true,
				},
				{
					label: "Название",
					field: "name",
					width: "5%",
				},
				{
					label: "Регион",
					field: "region",
					width: "5%",
					sortable: true,
				},
				{
					label: "Локация",
					field: "location",
					width: "5%",
					sortable: true,
				},
				{
					label: "Описание",
					field: "description",
					width: "5%",
				},
				{
					label: "Контакты",
					field: "contacts",
					display: (row: Offer) => {
						let html = "";
						row?.contacts.forEach((contact) => {
							//const parsedContact = checkNumber(contact.contact)
							html += `<span class="block">${contact.contact}</span>`;
						});
						return html;
					},
					width: "5%",
				},
			],
			rows: [] as Array<Offer>,
			pageSize: 10,
			sortable: {
				order: "id",
				sort: "asc",
			},
			totalRecordCount: 0,
			pageOptions: [{ value: 10, text: 10 }],
			messages: {
				pagingInfo: "Страницы {0}-{1} of {2}",
				pageSizeChangeLabel: "Кол-во предложений:",
				gotoPageLabel: "Переидти на страницу:",
				noDataAvailable: "Нет данных",
			},
		});

		const offers = ref<Offer[]>([]);

		onMounted(() => {
			fetch(SHELTERS_ENDPOINT)
				.then((data) => data.json())
				.then((data) => {
					table.totalRecordCount = data.length;
					data.forEach((item: any, index: number) => {
						offers.value.push({
							id: index,
							name: item.name,
							description: item.descript,
							type: item.type,
							categories: item.help_type || [],
							maxNumber: item.max_number,
							region: item.lev1,
							location: item.lev2,
							contacts: item.contacts,
						});
					});
					doSearch(0, table.pageSize, "id", "asc");
				});
		});

		/**
		 * Table search event
		 */

		function sortNumbers(a: any, b: any) {
			return a - b;
		}

		function sortStrings(a: any, b: any) {
			let nameA = a.toUpperCase(); // ignore upper and lowercase
			let nameB = b.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			// names must be equal
			return 0;
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
			table.isReSearch = offset == undefined;

			table.rows = offers.value
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

			table.sortable.order = order;
			table.sortable.sort = sort;
		};

		watch(
			[
				personsQnt,
				selectedOfferType,
				selectedOfferCategory,
				selectedOfferVariant,
			],
			() => {
				doSearch(0, table.pageSize, "id", "asc");
			},
		);

		return {
			offers,
			table,
			doSearch,
		};
	},
};
</script>

<style scoped>
::v-deep(.vtl-table .vtl-thead .vtl-thead-th) {
	@apply bg-blue-600 text-white border-blue-600;
}

::v-deep(.vtl-paging) {
	@apply justify-center;
}

::v-deep(.vtl-paging-count-label),
::v-deep(.vtl-paging-change-div),
::v-deep(.vtl-paging-page-label),
::v-deep(.vtl-paging-info) {
	@apply hidden;
}
::v-deep(.vtl-paging-pagination-page-link) {
	border: none;
}
</style>
