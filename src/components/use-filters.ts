import { ref } from "vue";

type Option = {
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
const offerCategoryL10n: Record<OfferCategory, string> = {
	[OfferCategory.other]: "Другое",
	[OfferCategory.home]: "Проживание",
	[OfferCategory.transport]: "Транспорт",
	[OfferCategory.medical]: "Медицинские услуги",
	[OfferCategory.consulting]: "Консультирование",
	[OfferCategory.volunteering]: "Волонтерство / Перевод",
	[OfferCategory.groceries]: "Одежда / Продукты / Питание",
	[OfferCategory.network]: "Услуги связи / Интернета",
};
export const offerCategory = (category: OfferCategory) =>
	offerCategoryL10n[category];
export const offerCategories: Option[] = [
	OfferCategory.other,
	OfferCategory.home,
	OfferCategory.transport,
	OfferCategory.medical,
	OfferCategory.consulting,
	OfferCategory.volunteering,
	OfferCategory.groceries,
	OfferCategory.network,
].map((c) => ({ name: offerCategory(c), id: c }));

export const offerTypes: Option[] = [
	{ name: "Неизвестно", id: OfferType.unknown },
	{ name: "Предлагаю", id: OfferType.offer },
	{ name: "Ищу", id: OfferType.search },
];

export const selectedOfferType = ref(offerTypes[0]);

export const selectedOfferCategory = ref<number[]>([]);

export const personsQnt = ref<number | null>(null);

export const offerVariants: Option[] = [
	{ name: "Все", id: 99 },
	{ name: "Государственные ", id: 0 },
	{ name: "Частные", id: 1 },
];

export const selectedOfferVariant = ref(offerVariants[0]);
