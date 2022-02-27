<template>
	<div class="flex flex-col">
		<div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
				<div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
						<tr>
							<th scope="col" class="cursor-pointer px-6 py-3 text-left text-xs hover:bg-blue-200 font-medium text-gray-600 uppercase tracking-wider">Название</th>
							<th scope="col" class="cursor-pointer px-6 py-3 text-left text-xs hover:bg-blue-200 font-medium text-gray-600 uppercase tracking-wider">Регион</th>
							<th scope="col" class="cursor-pointer px-6 py-3 text-left text-xs hover:bg-blue-200 font-medium text-gray-600 uppercase tracking-wider">Локация</th>
							<th scope="col" class="cursor-pointer px-6 py-3 text-left text-xs hover:bg-blue-200 font-medium text-gray-600 uppercase tracking-wider">Тип помощи</th>
							<th scope="col" class="relative px-6 py-3">
								<span class="sr-only">Edit</span>
							</th>
						</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="offer in offers" :key="offer.id">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="flex-shrink-0 h-10 w-10">
										<img class="h-10 w-10 rounded-full" :src="offer.image" alt="" />
									</div>
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">
											{{ offer.name }}
										</div>
										<div class="text-sm text-gray-500">
											{{ offer.email }}
										</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{{ offer.title }}</div>
								<div class="text-sm text-gray-500">{{ offer.department }}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"> Active </span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{{ offer.role }}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
type Offer = {
	id_point: number,
	type: string,
	name: string,
	region: string,
	location: string,
	helpType: string,
	description?: string,
	contacts: {
		phone1: string,
		phone2?: string,
		facebook?: string,
		email?: string,
	},
	secondary?: {
		address?: string,
		address2?: string,
	}
}


export default {
	name: 'OfferList',
	setup() {
		const offers: Offer[] = [
			{
				id: 0,
				name: 'Jane Cooper',
				region: 'Regional Paradigm Technician',
				location: 'Optimization',
				helpType: 'Admin',
				description: 'jane.cooper@example.com',
				contacts: {
					phone1: '+1 (917) 593-3258',
					phone2: '+1 (917) 593-3258',
					facebook: 'https://www.facebook.com/jane.cooper',
					email: 'example@example.com'
				},
				secondary: {
					address: '123 Main St',
					address2: 'Suite 200'
				}
			},
			{
				id: 1,
				name: 'Jane Cooper',
				region: 'Regional Paradigm Technician',
				location: 'Optimization',
				helpType: 'Admin',
				description: 'jane.cooper@example.com',
				contacts: {
					phone1: '+1 (917) 593-3258',
					facebook: 'https://www.facebook.com/jane.cooper',
					email: 'example@example.com'
				},
			},
			{
				id: 2,
				name: 'Jane Cooper',
				region: 'Regional Paradigm Technician',
				location: 'Optimization',
				helpType: 'Admin',
				description: 'jane.cooper@example.com',
				contacts: {
					phone1: '+1 (917) 593-3258',
					phone2: '+1 (917) 593-3258',
					facebook: 'https://www.facebook.com/jane.cooper',
					email: 'example@example.com'
				},
			},
			{
				id: 3,
				name: 'Jane Cooper',
				region: 'Regional Paradigm Technician',
				location: 'Optimization',
				helpType: 'Admin',
				description: 'jane.cooper@example.com',
				contacts: {
					phone1: '+1 (917) 593-3258',
					facebook: 'https://www.facebook.com/jane.cooper',
					email: 'example@example.com'
				},
				secondary: {
					address: '123 Main St',
					address2: 'Suite 200'
				}
			},
			// More people...
		]
		function filterBy(field) {

		}
		return {
			offers,
			filterBy
		}
	},
}
</script>
