import { BedrijfRegisterResponse, Dossier, VestigingAdres } from '../models/typesBedrijfRegisterAPI';
import { HandelRegisterResponse, Bestuurder } from '../models/typesHandelRegisterAPI';

export interface BusinessRegistryResponse {
	totalRowCount: number;
	businesses: Business[];
}

export interface Business {
	dossier: DossierInfo;
	name: string;
	alternateName?: string; // previously "handelsnaam"
	mainBranch: MainBranchInfo;
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
	branch: string; // split from dossiernummerString
	type: BusinessType;
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

export interface BusinessAddress extends VestigingAdres {}

export interface Manager extends Bestuurder {}

export interface CapitalInfo {
	invested: number;
	currencyId: number; // "kapitaalValutaId"
	currency: string; // "kapitaalValuta"
	startYearCapital?: number | null;
	endYearCapital?: number | null;
	totalCapital?: number | null; // possible combined or calculated field from the available capital fields
}
