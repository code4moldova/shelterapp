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

export type Poi = {
	x: number;
	y: number;
	fullname: string;
	addrnum: null;
	placename: string;
	sector: null;
	municipality: string;
	state: string;
	postalcode: string;
	pois: Array<{
		id_help_point: null;
		name_ro: string;
		name_ru: string;
		owner_type: number;
		phones: Array<{
			phone_type: number;
			phone_info: string;
			countrycode: string;
			prefix: string;
			phone: string;
			fullphone: string;
		}>;
	}>;
};
