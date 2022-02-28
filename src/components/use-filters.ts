import { ref } from "vue";

type Options = {
	name: string;
	id: OfferType | OfferCategory;
};

export enum OfferType {
	unknown,
	offer,
	search,
}

export enum OfferCategory {
	other = 0,
	home = 1,
	transport = 2,
	medical = 3,
	consulting = 4,
	volunteering = 5,
	groceries = 7,
	network = 8,
}

export const offerTypes: Options[] = [
	{ name: "Неизвестно", id: OfferType.unknown },
	{ name: "Предлагаю", id: OfferType.offer },
	{ name: "Ищу", id: OfferType.search },
];

export const selectedOfferType = ref(offerTypes[0]);

export const offerCategories: Options[] = [
	{ name: "Другое", id: OfferCategory.other },
	{ name: "Проживание", id: OfferCategory.home },
	{ name: "Транспорт", id: OfferCategory.transport },
	{ name: "Медицинские услуги", id: OfferCategory.medical },
	{ name: "Консультирование", id: OfferCategory.consulting },
	{ name: "Волонтерство / Перевод", id: OfferCategory.volunteering },
	{ name: "Одежда / Продукты / Питание", id: OfferCategory.groceries },
	{ name: "Услуги связи / Интернета", id: OfferCategory.network },
];

export const selectedOfferCategory = ref<Options[]>([]);

export const personsQnt = ref<number | null>(null);

export const offerVariants: Options[] = [
	{ name: "Все", id: 99 },
	{ name: "Государственные ", id: 0 },
	{ name: "Частные", id: 1 },
];

export const selectedOfferVariant = ref(offerVariants[0]);
