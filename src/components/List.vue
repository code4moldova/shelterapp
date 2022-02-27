<template>
	<ul class="space-y-3">
		<li v-for="i in 10" :key="i" class="bg-gray-100 rounded p-3">
			Offer {{ i }}
		</li>
	</ul>
</template>
