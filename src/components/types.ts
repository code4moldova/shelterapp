export type FilterOption = {
	name: string;
	id: number;
};

export type Offer = {
	id_point: number;
	type: FilterOption;
	help_type: FilterOption;
};

export type Contact = { contact_type: number; contact: string };
