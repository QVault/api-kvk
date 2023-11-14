export interface BusinessRegistryResponse {
	totalRowCount: number;
	businesses: Business[];
}

export interface Business {
	dossier: DossierInfo;
	name: string;
	alternateName?: string; // previously "handelsnaam"
	mainBranch: MainBranchInfo;
	subBranch: SubBranchInfo;
	legalForm: string; // previously "rechtsvorm"
	isActive: boolean; // previously "isActief"
	address: BusinessAddress;
	management: Manager[]; // previously "bestuur"
	capital: CapitalInfo;
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

export interface MainBranchInfo {
	code: string; // split from hoofdbranch
	description: string; // split from hoofdbranch
}

export interface SubBranchInfo {
	code: string | null;
	description: string | null;
}

export interface BusinessAddress {
	streetName?: string | null; // translated from 'straatnaam'
	countryId: number; // 'landId'
	countryName: string; // 'landnaam'
	cityName?: string | null; // translated from 'plaatsnaam'
	number?: string | null; // 'nummer'
	houseNumber?: number | null;
	addition?: string | null; // translated from 'toevoeging'
	gacCode: number; // 'gacCode'
	gacStreetName: string; // 'gacStraatnaam'
	zone: string; // 'zone'
	region: string; // 'regio'
	postalCode?: string | null; // translated from 'postcode'
}

export interface Manager {
	name: string;
	dossierNumber?: number | null;
	title?: string | null;
	role: string;
	birthCountry: string;
	birthPlace: string;
	startDate: Date;
	authority: string;
}

export interface CapitalInfo {
	invested: number;
	currencyId: number; // "kapitaalValutaId"
	currency: string; // "kapitaalValuta"
	startYearCapital?: number | null;
	endYearCapital?: number | null;
	totalCapital?: number | null; // possible combined or calculated field from the available capital fields
}
