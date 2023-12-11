import { VestigingAdres } from './typesBedrijfRegisterAPI';

export interface HandelRegisterResponse {
	dossiernummerString: string;
	bedrijfsnaam: string;
	handelsnaam: string;
	email: string | null;
	telefoonnummer: string | null;
	fax: string | null;
	type: string;
	registratienummer: number;
	filiaalnummer: number;
	vestigingAdres: VestigingAdres;
	productenBeschikbaar: boolean;
	bedrijfDetailsBasis: BedrijfDetailsBasis;
	bedrijfDetailsUitgebreid: BedrijfDetailsUitgebreid;
	id: number;
}

export interface BedrijfDetailsBasis {
	rechtsvorm: string;
	statutaireZetel: string | null;
	grootKlein: string;
	status: string;
	datumVestiging: string | null;
	datumIngangStatus: string;
	datumStatutenWijziging: string | null;
}

export interface BedrijfDetailsUitgebreid {
	financien: Capital | null;
	bestuur: Bestuurslid[];
	doelstellingNL: string | null;
	doelstellingEN: string | null;
	hoofdbranch: string;
	subbranches: string[];
}

export interface Bestuurslid {
	naam: string;
	dossiernummer: string | null;
	titel: string | null;
	functie: string;
	geboorteland: string;
	geboorteplaats: string;
	nationaliteit: string;
	ingangsDatum: string;
	bevoegdheid: string;
}

export interface Capital {
	kapitaalGestort: number | null;
	kapitaalValutaId: number | null;
	kapitaalValuta: string | null;
	kapitaalBeginBoekjaar: number | null;
	kapitaalEindBoekjaar: number | null;
}
