<template>
	<Dialog
		:open="isOpen"
		@close="$emit('close')"
		class="absolute top-14 left-0 bg-white px-8 py-4 w-full max-w-xl rounded"
	>
		<form @submit.prevent class="grid md:grid-cols-2 gap-4">
			<Listbox as="div" v-model="selectedOfferType">
				<ListboxLabel class="block text-sm font-medium text-gray-700">
					Тип Предложения
				</ListboxLabel>
				<div class="mt-1 relative">
					<ListboxButton
						class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					>
						<span class="block truncate">{{ selectedOfferType.name }}</span>
						<span
							class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
						>
							<SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
						</span>
					</ListboxButton>

					<transition
						leave-active-class="transition ease-in duration-100"
						leave-from-class="opacity-100"
						leave-to-class="opacity-0"
					>
						<ListboxOptions
							class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
						>
							<ListboxOption
								as="template"
								v-for="offerType in offerTypes"
								:key="offerType.name"
								:value="offerType"
								v-slot="{ active, selected }"
							>
								<li
									:class="[
										active ? 'text-white bg-blue-600' : 'text-gray-900',
										'cursor-default select-none relative py-2 pl-3 pr-9',
									]"
								>
									<span
										:class="[
											selected ? 'font-semibold' : 'font-normal',
											'block truncate',
										]"
									>
										{{ offerType.name }}
									</span>

									<span
										v-if="selected"
										:class="[
											active ? 'text-white' : 'text-blue-600',
											'absolute inset-y-0 right-0 flex items-center pr-4',
										]"
									>
										<CheckIcon class="h-5 w-5" aria-hidden="true" />
									</span>
								</li>
							</ListboxOption>
						</ListboxOptions>
					</transition>
				</div>
			</Listbox>
			<div>
				<label class="typo__label">Категория помощи</label>
				<Multiselect
					v-model="selectedOfferCategory"
					:options="offerCategories"
					placeholder="Категории помощи"
					mode="multiple"
					:close-on-select="false"
					label="name"
					track-by="name"
					valueProp="id"
					:preselect-first="true"
					class="multiselect-blue"
				>
					<template v-slot:multiplelabel="{ values }">
						<div class="multiselect-multiple-label">
							{{ values.length }} опции выбрано
						</div>
					</template>
				</Multiselect>
			</div>

			<div>
				<label for="persons" class="block text-sm font-medium text-gray-700"
					>Кол-во людей</label
				>
				<div>
					<input
						type="number"
						name="persons"
						id="persons"
						class="shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
						placeholder="Кол-во человек"
						v-model="personsQnt"
					/>
				</div>
			</div>
			<Listbox as="div" v-model="selectedOfferVariant">
				<ListboxLabel class="block text-sm font-medium text-gray-700">
					Источники помощи
				</ListboxLabel>
				<div class="mt-1 relative">
					<ListboxButton
						class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					>
						<span class="block truncate">{{ selectedOfferVariant.name }}</span>
						<span
							class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
						>
							<SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
						</span>
					</ListboxButton>

					<transition
						leave-active-class="transition ease-in duration-100"
						leave-from-class="opacity-100"
						leave-to-class="opacity-0"
					>
						<ListboxOptions
							class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
						>
							<ListboxOption
								as="template"
								v-for="offerVariant in offerVariants"
								:key="offerVariant.name"
								:value="offerVariant"
								v-slot="{ active, selected }"
							>
								<li
									:class="[
										active ? 'text-white bg-blue-600' : 'text-gray-900',
										'cursor-default select-none relative py-2 pl-3 pr-9',
									]"
								>
									<span
										:class="[
											selected ? 'font-semibold' : 'font-normal',
											'block truncate',
										]"
									>
										{{ offerVariant.name }}
									</span>

									<span
										v-if="selected"
										:class="[
											active ? 'text-white' : 'text-blue-600',
											'absolute inset-y-0 right-0 flex items-center pr-4',
										]"
									>
										<CheckIcon class="h-5 w-5" aria-hidden="true" />
									</span>
								</li>
							</ListboxOption>
						</ListboxOptions>
					</transition>
				</div>
			</Listbox>
		</form>

		<button @click="$emit('close')" class="absolute top-2 right-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="feather feather-x feather-sm"
				style="width: 13px; height: 13px"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
	Dialog,
	DialogOverlay,
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";
import {
	selectedOfferType,
	offerTypes,
	offerCategories,
	selectedOfferCategory,
	personsQnt,
	offerVariants,
	selectedOfferVariant,
} from "./use-filters";
import Multiselect from "@vueform/multiselect";

export default defineComponent({
	name: "HeaderFilter",
	components: {
		Dialog,
		DialogOverlay,
		Listbox,
		ListboxButton,
		ListboxLabel,
		ListboxOption,
		ListboxOptions,
		Multiselect,
		CheckIcon,
		SelectorIcon,
	},
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		return {
			offerTypes,
			selectedOfferType,
			offerCategories,
			selectedOfferCategory,
			personsQnt,
			offerVariants,
			selectedOfferVariant,
		};
	},
});
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
