<template>
	<Dialog :model-value="true" title="Create Offer">
		<form @submit="sendOffer">
			<div class="mt-2">
				<label for="name" class="block text-sm font-medium text-gray-700">
					Имя <span class="text-red-500">*</span>
				</label>
				<div class="mt-1">
					<input
						required
						type="text"
						name="name"
						id="name"
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					/>
				</div>
			</div>

			<div class="mt-2">
				<label for="type" class="block text-sm font-medium text-gray-700">
					Тип помощи <span class="text-red-500">*</span>
				</label>
				<select
					required
					id="type"
					name="type"
					class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
				>
					<option>Type 1</option>
					<option>Type 2</option>
					<option>Type 3</option>
				</select>
			</div>

			<div class="mt-2">
				<label for="details" class="block text-sm font-medium text-gray-700">
					Детали
				</label>
				<div class="mt-1">
					<textarea
						rows="4"
						name="details"
						id="details"
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					></textarea>
				</div>
			</div>

			<div class="mt-2">
				<label for="persons" class="block text-sm font-medium text-gray-700">
					Макс. человек
				</label>
				<div class="mt-1">
					<input
						type="number"
						name="persons"
						id="persons"
						class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					/>
				</div>
			</div>

			<div v-for="contact in contacts" class="mt-2 flex gap-2 items-center">
				<div>
					<label
						for="contact-type"
						class="block text-sm font-medium text-gray-700"
					>
						Тип контакта
					</label>
					<select
						required
						id="contact-type"
						name="contact-type"
						class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
					>
						<option>Type 1</option>
						<option>Type 2</option>
						<option>Type 3</option>
					</select>
				</div>
				<div class="flex-1">
					<label for="contact" class="block text-sm font-medium text-gray-700">
						Контакт <span class="text-red-500">*</span>
					</label>
					<div class="mt-1">
						<input
							required
							type="text"
							name="contact"
							id="contact"
							class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
						/>
					</div>
				</div>
				<div class="flex-shrink-0">
					<!-- Added for space -->
					<label class="block text-sm font-medium">&nbsp;</label>
					<button
						type="button"
						:disabled="isMinimumContacts"
						class="px-1 text-xl"
						:class="isMinimumContacts ? 'text-gray-500' : 'text-red-500'"
						@click="removeContact(contact)"
					>
						&times
					</button>
				</div>
			</div>

			<div class="mt-4 flex gap-3 justify-end">
				<button
					type="button"
					class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 border-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
					@click="addContact"
				>
					Add Contact
				</button>
				<button
					type="submit"
					class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
				>
					Send
				</button>
			</div>
		</form>
	</Dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import Dialog from "./Dialog.vue";

type Contact = { type: "tel"; value: "" };

const contacts = ref<Contact[]>([{ type: "tel", value: "" }]);

const isMinimumContacts = computed(() => contacts.value.length <= 1);

function addContact() {
	contacts.value = [...contacts.value, { type: "tel", value: "" }];
}
function removeContact(contact: Contact) {
	if (isMinimumContacts.value) return;
	contacts.value = contacts.value.filter((c) => c !== contact);
}

function sendOffer(e: Event) {
	e.preventDefault();
	// const form = e.target as HTMLFormElement
}

const isOpen = ref(true);

function closeModal() {
	isOpen.value = false;
}
function openModal() {
	isOpen.value = true;
}
</script>
