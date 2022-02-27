<template>
	<TransitionRoot appear :show="modelValue" as="template">
		<Dialog as="div" @close="closeModal">
			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="min-h-screen px-4 text-center">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0"
						enter-to="opacity-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100"
						leave-to="opacity-0"
					>
						<DialogOverlay class="fixed inset-0 bg-black opacity-30" />
					</TransitionChild>

					<span class="inline-block h-screen align-middle" aria-hidden="true">
						&#8203;
					</span>

					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<div
							class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
						>
							<DialogTitle
								as="h3"
								class="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
							>
								{{ title }}
								<button
									@click="closeModal"
									class="px-2 pb-1 text-2xl"
									type="button"
								>
									&times;
								</button>
							</DialogTitle>

							<slot />
						</div>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script lang="ts" setup>
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogOverlay,
	DialogTitle,
} from "@headlessui/vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({ modelValue: Boolean, title: String });
const closeModal = () => emit("update:modelValue", !props.modelValue);
</script>
