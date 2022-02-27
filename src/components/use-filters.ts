import { ref } from "vue";

type Options = {
	name: string;
	id: OfferType;
};

export enum OfferType {
	unknown,
	offer,
	search,
}

export const offerTypes: Options[] = [
	{ name: "Неизвестно", id: OfferType.unknown },
	{ name: "Предлагаю", id: OfferType.offer },
	{ name: "Ищу", id: OfferType.search },
];

export const selectedOfferType = ref(offerTypes[0]);

export const offerCategories: Options[] = [
	{ name: "Другое", id: 0 },
	{ name: "Проживание", id: 1 },
	{ name: "Транспорт", id: 2 },
	{ name: "Медицинские услуги", id: 3 },
	{ name: "Консультирование", id: 4 },
	{ name: "Волонтерство / Перевод", id: 5 },
	{ name: "Одежда / Продукты / Питание", id: 7 },
	{ name: "Услуги связи / Интернета", id: 8 },
];

export const selectedOfferCategory = ref<Options[]>([]);

export const personsQnt = ref<number | null>(null);

export const offerVariants: Options[] = [
	{ name: "Все", id: 99 },
	{ name: "Государственные ", id: 0 },
	{ name: "Частные", id: 1 },
];

export const selectedOfferVariant = ref(offerVariants[0]);
