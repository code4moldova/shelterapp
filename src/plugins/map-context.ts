import { inject, InjectionKey, Plugin, ref } from "vue";

type MapContext = ReturnType<typeof createContext>;
const injectionKey: InjectionKey<MapContext> = Symbol("mapContext");

function createContext() {
	const activePointLayer = ref(false);
	const mapCenter = ref<number[]>();
	return { activePointLayer, mapCenter };
}

export const mapContext: Plugin = (app) => {
	const context = createContext();
	app.provide(injectionKey, context);
};

export function useMapContext() {
	const value = inject(injectionKey);
	if (value) return value;
	throw new Error("useMapContext must be used inside mapContext");
}
