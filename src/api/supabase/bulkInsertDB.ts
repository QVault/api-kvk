import { Context } from 'hono';
import { mapBusinessData, mapCapitalData, mapAddressData, mapBranchData, mapManagerData } from '../../mappings';
import { Business } from '../../models/newTypes';

export default async function addBulkCompleteBusinessData(c: Context, businesses: Business | Business[]) {
	businesses = Array.isArray(businesses) ? businesses : [businesses];

	const businessDataToInsert = [];
	const capitalDataToUpsert = [];
	const addressDataToUpsert = [];
	const branchDataToUpsert = [];
	const managerDataToUpsert = [];

	for (const business of businesses) {
		// Collect data for each business
		const businessID = business.id; // Assuming you have the business ID available
		businessDataToInsert.push(mapBusinessData(business));

		// Collect Capital, Address, Branch, Manager data for bulk operations
		capitalDataToUpsert.push(...mapCapitalData(business.capital, businessID));
		addressDataToUpsert.push(...mapAddressData(business.address, businessID));
		branchDataToUpsert.push(...business.branches.map((branch) => ({ ...mapBranchData(branch, businessID) })));
		managerDataToUpsert.push(...business.management.map((manager) => ({ ...mapManagerData(manager, businessID) })));
	}

	// Perform bulk operations
	try {
		await bulkInsertBusinesses(c, businessDataToInsert);
		await bulkUpsertCapital(c, capitalDataToUpsert);
		await bulkUpsertAddress(c, addressDataToUpsert);
		await bulkUpsertBranch(c, branchDataToUpsert);
		await bulkUpsertManager(c, managerDataToUpsert);
	} catch (error) {
		console.error('Error processing businesses in bulk:', error);
	}
}
