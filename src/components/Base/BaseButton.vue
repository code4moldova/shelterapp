<template>
	<button @click="$emit('click')" :class="cssStyles">
		<slot />
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";

export default defineComponent({
	name: "BaseButton",
	props: {
		color: {
			type: String as PropType<"blue" | "white-outline" | "red">,
			default: "border-white",
		},
	},
	emits: ["click"],
	setup(props) {
		const cssStyles = computed(() => {
			switch (props.color) {
				case "white-outline":
					return "border-white";
				case "red":
					return "border-red-500";
				default:
					return "border border-white py-2 px-4 rounded text-white leading-none hover:bg-white hover:text-blue-500 hover:border-blue-500";
			}
		});

		return {
			cssStyles,
		};
	},
});
</script>
