<template>
	<div>
		<div class="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="cursor-pointer px-6 py-3 text-left text-xs hover:bg-blue-200 font-medium text-gray-600 uppercase tracking-wider bg-gray-200"
						>
							Название
						</th>
						<th
							scope="col"
							class="cursor-pointer px-6 py-3 text-left text-xs hover:bg-blue-200 font-medium text-gray-600 uppercase tracking-wider bg-gray-200"
						>
							Регион
						</th>
						<th
							scope="col"
							class="cursor-pointer px-6 py-3 text-left text-xs hover:bg-blue-200 font-medium text-gray-600 uppercase tracking-wider bg-gray-200"
						>
							Локация
						</th>
						<th
							scope="col"
							class="cursor-pointer px-6 py-3 text-left text-xs hover:bg-blue-200 font-medium text-gray-600 uppercase tracking-wider bg-gray-200"
						>
							Тип помощи
						</th>
						<th scope="col" class="relative px-6 py-3 bg-gray-200">
							<span class="sr-only">Edit</span>
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="offer in offers" :key="offer.id">
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
								<!--									<div class="flex-shrink-0 h-10 w-10">-->
								<!--										<img class="h-10 w-10 rounded-full" :src="offer.image" alt="" />-->
								<!--									</div>-->
								<div>
									<div class="text-sm font-medium text-gray-900">
										{{ offer.name }}
									</div>
								</div>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{{ offer.region }}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							<div class="text-sm text-gray-500">{{ offer.location }}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							<div class="text-sm text-gray-500">{{ offer.helpType }}</div>
						</td>
						<td class="flex items-center text-sm py-4 px-6">
							<a
								v-if="offer.contacts.phone1"
								:href="`tel:${offer.contacts.phone1}`"
								class="text-blue-600 hover:text-blue-900"
							>
								<PhoneIcon class="h-5 w-5 text-blue-500" />
							</a>
							<a
								v-if="offer.contacts.phone2"
								:href="`tel:${offer.contacts.phone2}`"
								class="text-blue-600 hover:text-blue-900"
							>
								<PhoneIcon class="h-5 w-5 text-blue-500" />
							</a>
							<a
								v-if="offer.contacts.email"
								:href="`mailto:${offer.contacts.phone1}`"
								class="text-blue-600 hover:text-blue-900"
							>
								<MailIcon class="h-5 w-5 text-blue-500" />
							</a>
							<a
								v-if="offer.contacts.facebook"
								target="_blank"
								:href="offer.contacts.facebook"
								class="text-blue-600 hover:text-blue-900"
							>
								<IconFB />
							</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts">
import { PhoneIcon, MailIcon } from "@heroicons/vue/solid";
import IconFB from "../icons/IconFB.vue";
import { ref } from "vue";
type Offer = {
	id: number;
	type: string;
	name: string;
	region: string;
	location: string;
	helpType: string;
	description?: string;
	contacts: {
		phone1: string;
		phone2?: string;
		facebook?: string;
		email?: string;
	};
	secondary?: {
		address?: string;
		address2?: string;
	};
};

export default {
	name: "OfferList",
	components: {
		IconFB,
		PhoneIcon,
		MailIcon,
	},
	setup() {
		const initialOffers: Offer[] = [
			{
				id: 0,
				type: "type",
				name: "Offer name",
				region: "Chisinau",
				location: "Centru",
				helpType: "Medicamente",
				contacts: {
					phone1: "+1 (917) 593-3258",
					phone2: "+1 (917) 593-3258",
					facebook: "https://www.facebook.com/jane.cooper",
					email: "example@example.com",
				},
				secondary: {
					address: "123 Main St",
					address2: "Suite 200",
				},
			},
			{
				id: 1,
				type: "type",
				name: "Offer name",
				region: "Chisinau",
				location: "Centru",
				helpType: "Medicamente",
				contacts: {
					phone1: "+1 (917) 593-3258",
					phone2: "+1 (917) 593-3258",
					facebook: "https://www.facebook.com/jane.cooper",
					email: "example@example.com",
				},
				secondary: {
					address: "123 Main St",
					address2: "Suite 200",
				},
			},
			{
				id: 2,
				type: "type",
				name: "Offer name",
				region: "Chisinau",
				location: "Centru",
				helpType: "Medicamente",
				contacts: {
					phone1: "+1 (917) 593-3258",
					phone2: "+1 (917) 593-3258",
					facebook: "https://www.facebook.com/jane.cooper",
					email: "example@example.com",
				},
				secondary: {
					address: "123 Main St",
					address2: "Suite 200",
				},
			},
			{
				id: 3,
				type: "type",
				name: "Offer name",
				region: "Chisinau",
				location: "Centru",
				helpType: "Medicamente",
				contacts: {
					phone1: "+1 (917) 593-3258",
					phone2: "+1 (917) 593-3258",
					facebook: "https://www.facebook.com/jane.cooper",
					email: "example@example.com",
				},
				secondary: {
					address: "123 Main St",
					address2: "Suite 200",
				},
			},
			// More people...
		];

		const offers = ref<Offer[]>(initialOffers);

		// function filterBy(field) {
		//
		// }
		return {
			offers,
			//filterBy,
		};
	},
};
</script>
