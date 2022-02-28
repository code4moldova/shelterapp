<template>
	<form @submit="sendOffer">
		<div class="mt-2">
			<label for="name" class="block text-sm font-medium text-gray-700">
				Имя <span class="text-red-500">*</span>
			</label>
			<div class="mt-1">
				<input
					v-model="name"
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
				v-model="help_type"
				required
				id="type"
				name="type"
				class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
			>
				<option v-for="type in offerCategories" :value="type.id" :key="type.id">
					{{ type.name }}
				</option>
			</select>
		</div>

		<div class="mt-2">
			<label for="details" class="block text-sm font-medium text-gray-700">
				Детали
			</label>
			<div class="mt-1">
				<textarea
					v-model="descript"
					rows="4"
					name="details"
					id="details"
					class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
				></textarea>
			</div>
		</div>

		<div class="mt-2">
			<label for="persons" class="block text-sm font-medium text-gray-700">
				Макс. человек <span class="text-red-500">*</span>
			</label>
			<div class="mt-1">
				<input
					required
					v-model="max_number"
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
					:for="`contact-type-${contact.contact_type}`"
					class="block text-sm font-medium text-gray-700"
				>
					Тип контакта
				</label>
				<select
					v-model="contact.contact_type"
					required
					:id="`contact-type-${contact.contact_type}`"
					:name="`contact-type-${contact.contact_type}`"
					class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
				>
					<option
						v-for="contactType in contactTypes"
						:value="contactType.contact_type"
						:key="contactType.contact_type"
					>
						{{ contactType.name }}
					</option>
				</select>
			</div>
			<div class="flex-1">
				<label for="contact" class="block text-sm font-medium text-gray-700">
					Контакт <span class="text-red-500">*</span>
				</label>
				<div class="mt-1">
					<input
						v-model="contact.contact"
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
					&times;
				</button>
			</div>
		</div>

		<div class="mt-4 flex gap-3 justify-end">
			<button
				type="button"
				class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 border-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
				@click="addContact"
			>
				Добавить контакт
			</button>
			<button
				type="submit"
				class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
				:class="createOfferLoading ? 'bg-gray-100' : 'bg-blue-100'"
				:disabled="createOfferLoading"
			>
				<LoadingIcon
					v-if="createOfferLoading"
					class="animate-spin -ml-1 mr-3 text-white h-5 w-5"
				/>
				<span v-if="!createOfferLoading">Отправлять</span>
				<span v-else>Отправка</span>
			</button>
		</div>
		<div v-if="createOfferError" class="text-red-500 text-right text-sm">
			Что-то пошло не так
		</div>
		<div v-if="createOfferSuccess" class="text-green-500 text-right text-sm">
			Отправлено
		</div>
	</form>
</template>

<script lang="ts" setup>
import { computed, PropType, ref } from "vue";

import { offerCategories, OfferType } from "./use-filters";
import type { Contact } from "./types";
import LoadingIcon from "../icons/LoadingIcon.vue";

const props = defineProps({
	type: {
		type: Number as PropType<OfferType>,
		required: true,
	},
	lat: {
		type: Number,
		required: true,
	},
	lon: {
		type: Number,
		required: true,
	},
	lev1: {
		type: String,
		required: true,
	},
	lev2: {
		type: String,
		required: true,
	},
});

const createOfferLoading = ref(false);
const createOfferSuccess = ref(false);
const createOfferError = ref(false);
const contactTypes = [
	{ name: "Другой", contact_type: 0 },
	{ name: "Моб. телефон", contact_type: 1 },
	{ name: "Дом. телефон", contact_type: 2 },
	{ name: "Вайбер", contact_type: 3 },
	{ name: "Ватсап", contact_type: 4 },
	{ name: "Телеграм", contact_type: 5 },
	{ name: "Фейсбук", contact_type: 6 },
	{ name: "Инстаграм", contact_type: 7 },
	{ name: "Эл. адрес", contact_type: 8 },
	{ name: "Веб-сайт", contact_type: 9 },
];

const lon = ref(props.lon);
const lat = ref(props.lat);
const crs = ref(4326);
const type = ref(props.type);
const help_type = ref("0");
const name = ref("");
const max_number = ref("");
const postalcode = ref(0);
const bua = ref("");
const lev1 = ref(props.lev1);
const lev2 = ref(props.lev2);
const descript = ref("");
const contacts = ref<Contact[]>([{ contact_type: 1, contact: "" }]);

const isMinimumContacts = computed(() => contacts.value.length <= 1);

function addContact() {
	contacts.value = [...contacts.value, { contact_type: 1, contact: "" }];
}
function removeContact(contact: Contact) {
	if (isMinimumContacts.value) return;
	contacts.value = contacts.value.filter((c) => c !== contact);
}

function sendOffer(e: Event) {
	e.preventDefault();
	const body = {
		lon: lon.value,
		lat: lat.value,
		crs: crs.value,
		type: type.value,
		help_type: help_type.value,
		name: name.value,
		max_number: max_number.value,
		postalcode: postalcode.value,
		bua: bua.value,
		lev1: lev1.value,
		lev2: lev2.value,
		descript: descript.value,
		contacts: contacts.value.map((c) => ({ ...c })),
	};

	createOfferSuccess.value = false;
	createOfferError.value = false;
	createOfferLoading.value = true;
	fetch("https://api.iharta.md/helpua/offer/", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})
		.then(() => {
			createOfferSuccess.value = true;
			createOfferLoading.value = false;
			createOfferError.value = false;
		})
		.catch(() => {
			createOfferSuccess.value = false;
			createOfferLoading.value = false;
			createOfferError.value = true;
		});
}
</script>
