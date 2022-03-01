import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { Style, Stroke } from "ol/style";
import { onMounted, ref, watch } from "vue";
import { FeatureCollection } from "geojson";

export function useRoads() {
	const selectedRoad = ref();

	const roads = [
		{
			name: "Маршрут передвижения №1",
			help_road_nr: 1,
			info: `ПТФС Паланка-Маяки-Удобное - Штефан-Водэ - Каушэнь - мун.Кишинэу - Центр временного размещения иностранцев (дорога R52 - R30 - R2).`,
		},
		{
			name: "Маршрут передвижения №2",
			help_road_nr: 2,
			info: `ПТФС Тудора-Староказачье - Штефан-Водэ - Каушэнь - мун. Кишинэу - Центр временного размещения иностранцев (дорога R52 - R30).`,
		},
		{
			name: "Маршрут передвижения №3",
			help_road_nr: 3,
			info: `Отачь-Могилев-Подольск - Бэлць - Кишинэу - Пункт временного размещения иностранцев (дорога Е583 - М14).`,
		},
		{
			name: "Маршрут передвижения №4",
			help_road_nr: 4,
			info: `ПТФС Крива-Мамалыга - Липканы - Бэлць - Кишинэу - Центр временного размещения иностранцев (дорога - М14).`,
		},
		{
			name: "Маршрут передвижения №5",
			help_road_nr: 5,
			info: `ПТФС Мирное-Табаки – Комрат – Чимишлия – Кишинэу – Центр временного размещения иностранцев (дорога Е584).`,
		},
		{
			name: "Маршрут передвижения №6",
			help_road_nr: 6,
			info: `Или. Кишинэу - ППГ Леушень-Албица (дорога E581).`,
		},
		{
			name: "Маршрут передвижения №7",
			help_road_nr: 7,
			info: `Г. Кишинэу – Кэлэрашь – Унгень – ППГ Скулень-Скулень (дорога E58).`,
		},
	];

	const roadFeatureCollections = ref<FeatureCollection[]>([]);
	const roadsSource = new VectorSource();
	const roadsLayer = new VectorLayer({
		source: roadsSource,
		style: new Style({ stroke: new Stroke({ color: "green", width: 2 }) }),
	});

	watch(selectedRoad, (selected) => {
		const feature = roadFeatureCollections.value.find((fc) => {
			const [f] = fc.features;
			return f.properties?.help_road_nr === selected.help_road_nr;
		});
		roadsSource.clear();
		roadsSource.addFeatures(new GeoJSON().readFeatures(feature));
	});

	onMounted(async () => {
		const response = await fetch("/help_roads_3857.geojson");
		const json = await response.json();

		// Split GeoJSON FeatureCollection into multiple FeatureCollection
		roadFeatureCollections.value = json.features.map((f: any) => ({
			...json,
			features: [f],
		}));
	});

	return { roadsLayer, roads, selectedRoad };
}
