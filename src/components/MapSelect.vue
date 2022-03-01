<template>
	<Listbox
		:model-value="modelValue"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<div class="relative mt-1 inline-block">
			<ListboxButton
				class="relative w-full py-2 pl-3 pr-10 border-2 border-blue-500 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 text-xs"
			>
				<span class="block truncate">
					{{ modelValue ? modelValue.name : label }}
				</span>
				<span
					class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
				>
					<SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
				</span>
			</ListboxButton>

			<transition
				leave-active-class="transition duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<ListboxOptions
					class="absolute py-1 mt-1 overflow-auto border-2 border-blue-500 text-base bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				>
					<ListboxOption
						v-slot="{ active, selected }"
						v-for="option in options"
						:key="option.name"
						:value="option"
						as="template"
					>
						<li
							:class="[
								active ? 'text-blue-900 bg-blue-100' : 'text-gray-900',
								'cursor-default select-none relative py-2 pl-10 pr-4',
							]"
						>
							<span
								:class="[
									selected ? 'font-medium' : 'font-normal',
									'block truncate',
								]"
							>
								{{ option.name }}
							</span>
							<span
								v-if="selected"
								class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
							>
								<CheckIcon class="w-5 h-5" aria-hidden="true" />
							</span>
						</li>
					</ListboxOption>
				</ListboxOptions>
			</transition>
		</div>
	</Listbox>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import {
	Listbox,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";

defineEmits(["update:modelValue"]);
defineProps({
	modelValue: Object as PropType<{ name: string }>,
	options: Array as PropType<Array<{ name: string }>>,
	label: String as PropType<string>,
});
</script>
