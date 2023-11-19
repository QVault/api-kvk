function safeToString(value) {
	return value === null || value === undefined ? '' : value.toString();
}

async function updateAndLogChanges(supabase, tableName, existingRecord, newData, mapDataToTable) {
	const changes = [];
	const newDataPrepared = mapDataToTable(newData);
	for (const key in newDataPrepared) {
		if (newDataPrepared[key] !== existingRecord[key]) {
			changes.push({
				column: key,
				oldValue: safeToString(existingRecord[key]),
				newValue: safeToString(newDataPrepared[key]),
			});
		}
	}

	const filteredChanges = changes.filter((change) => change.column !== 'company_id');

	// Check if there are any changes left after filtering
	if (filteredChanges.length === 0) {
		console.log('returned!');
		return { error: null, noChanges: true, recordId: existingRecord.id };
	}

	let dbPairKey = tableName === 'company' ? 'external_id' : 'company_id';
	let dbPairValue = tableName === 'company' ? existingRecord.external_id : existingRecord.company_id;
	const recordID = tableName === 'company' ? existingRecord.id : existingRecord.company_id;

	console.log(dbPairKey, dbPairValue, changes);

	const { error: updateError } = await supabase.from(tableName).update(newDataPrepared).eq(dbPairKey, dbPairValue);

	if (updateError) {
		//console.error('Error in update operation:', updateError);
		throw updateError;
	}

	for (const change of filteredChanges) {
		console.log('changes!');
		const { error: logError } = await supabase.from('data_version').insert({
			table_name: tableName,
			record_id: recordID,
			// external_id: existingRecord.external_id,
			changed_column: change.column,
			old_value: change.oldValue,
			new_value: change.newValue,
		});

		if (logError) {
			console.error('Error logging changes:', logError);
			//::TODO
			throw logError;
		}
	}

	return { error: null, changesLogged: true, recordId: existingRecord.id, changed: changes };
}

export { updateAndLogChanges };
