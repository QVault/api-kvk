import { VestigingAdres } from './typesBedrijfRegisterAPI';

export interface HandelRegisterResponse {
	dossiernummerString: string;
	type: string;
	nummer: number;
	filiaalNummer: number;
	bedrijfsnaam: string;
	handelsnaam: string;
	hoofdbranch: string;
	rechtsvorm: string;
	bestuur: Array<Bestuurder>;
	vestigingAdres: VestigingAdres;
	kapitaalGestort: number;
	kapitaalMaatschappelijk: number;
	kapitaalGeplaatst: number;
	kapitaalValutaId: number;
	kapitaalValuta: string;
	kapitaalBeginBoekjaar?: number | null;
	kapitaalEindBoekjaar?: number | null;
	statutaireZetel: string;
	datumVestiging: Date;
	datumIngangStatus: Date;
	doelstellingNL: string;
	datumStatutenWijziging?: Date | null;
	status: string;
	productenBeschikbaar: boolean;
	id: number;
	subbranches: Array<string>;
}

export interface Bestuurder {
	naam: string;
	dossiernummer?: number | null;
	titel?: string | null;
	functie: string;
	geboorteland: string;
	geboorteplaats: string;
	ingangsDatum: Date;
	bevoegdheid: string;
}
