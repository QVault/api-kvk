import { BusinessAddress, CapitalInfo, Business, BusinessManager } from './models/newTypes';

export function mapBusinessData(business: Business) {
	return {
		dossier_code: business.dossier.code,
		registration_number: business.dossier.branchNumber,
		name: business.name,
		alternate_name: business.alternateName,
		business_type: business.businessType,
		establishment_date: business.dateOfEstablishment,
		status_date: business.dateOfStatus,
		statute_change_date: business.dateOfStatuteChange,
		legal_form: business.legalForm,
		is_active: business.isActive,
		status: business.status,
		products_available: business.productsAvailable,
		objective: business.objective,
		external_id: business.id.toString(),
	};
}

export function mapAddressData(address: BusinessAddress, companyId: number) {
	return {
		company_id: companyId,
		street_name: address.streetName,
		country_id: address.countryId,
		country_name: address.countryName,
		city_name: address.cityName,
		number: address.number,
		house_number: address.houseNumber,
		addition: address.addition,
		gac_code: address.gacCode,
		gac_street_name: address.gacStreetName,
		zone: address.zone,
		region: address.region,
	};
}

export function mapCapitalData(capital: CapitalInfo, companyId: number) {
	return {
		company_id: companyId,
		invested: capital.invested,
		currency_id: capital.currencyId,
		currency: capital.currency,
		//start_year_capital: capital.startYearCapital,
		//end_year_capital: capital.endYearCapital,
	};
}
// NOTE NOT USED, IS INLINE.
export function mapBranchData(branch: { code: string; description: string; branchType: string }, companyId: number) {
	return {
		company_id: companyId,
		code: branch.code,
		description: branch.description,
		branch_type: branch.branchType,
	};
}

export function mapManagerData(manager: BusinessManager, companyId: number) {
	return {
		holding_company_dossier_code: manager.dossierNumber,
		company_id: companyId,
		name: manager.name,
		role: manager.role,
		birth_country: manager.birthCountry,
		birth_place: manager.birthPlace,
		start_date: manager.startDate,
		authority: manager.authority,
		title: manager.title,
		unique_identifier: `${manager.name}-${companyId}`,
	};
}
