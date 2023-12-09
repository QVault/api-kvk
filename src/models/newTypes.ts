export interface BusinessRegistryResponse {
	totalRowCount: number;
	businesses: Business[];
}

export interface Business {
	dossier: DossierInfo;
	name: string;
	alternateName?: string; // previously "handelsnaam"
	branches: BranchInfo[];
	businessType?: string;
	legalForm: string; // previously "rechtsvorm"
	isActive: boolean; // previously "isActief"
	address: BusinessAddress;
	management: BusinessManager[]; // previously "bestuur"
	capital?: CapitalInfo;
	objective?: string; // "doelstellingNL"
	status: string;
	productsAvailable: boolean;
	id: number;
}

export interface DossierInfo {
	code: string; // split from dossiernummerString
	//branch?: string; // split from dossiernummerString
	type: string;
	registrationNumber: number; // "registratienummer"
	branchNumber: number; // "filiaalNummer"
}

export interface BusinessType {
	nameEN: string;
	nameES: string;
	id: number;
	name: string;
}

export interface BranchInfo {
	code: string;
	description: string;
}

export interface BusinessAddress {
	streetName?: string | null;
	countryId: number;
	countryName: string;
	cityName?: string | null;
	number?: string | null;
	houseNumber?: number | null;
	addition?: string | null;
	gacCode: number;
	gacStreetName: string;
	zone: string;
	region: string;
	postalCode?: string | null;
}

export interface BusinessManager {
	name: string;
	dossierNumber?: string | null;
	title: string | null;
	role: string;
	birthCountry: string | null;
	birthPlace: string | null;
	startDate: Date;
	authority: string;
}

export interface CapitalInfo {
	invested?: number;
	currencyId?: number; // "kapitaalValutaId"
	currency?: string; // "kapitaalValuta"
	startYearCapital?: number | null;
	endYearCapital?: number | null;
	totalCapital?: number | null; // possible combined or calculated field from the available capital fields
}
