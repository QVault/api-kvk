import { insertBusinessAddress } from './insertAddressData';
import { insertBranches } from './insertBranchData';
import { insertBusiness } from './insertBusinessData';
import { insertCapital } from './insertCapitalData';
import { insertManagers } from './insertManagementData';
//s
import { Business } from '../../models/newTypes';
import { Context } from 'hono';

async function addCompleteBusinessData(c: Context, businesses: Business[]) {
	for (const business of businesses) {
		const companyId = await insertBusiness(c, business);

		if (companyId) {
			await insertBusinessAddress(c, companyId, business.address);
			await insertCapital(c, companyId, business.capital);
			await insertBranches(c, companyId, business.branches);
			await insertManagers(c, companyId, business.management);
		}
	}
}

export { addCompleteBusinessData };
