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

	if (changes.length === 0) {
		return { error: null, noChanges: true };
	}

	const { error: updateError } = await supabase.from(tableName).update(newDataPrepared).eq('external_id', existingRecord.external_id);

	if (updateError) {
		//console.error('Error in update operation:', updateError);
		throw updateError;
	}

	for (const change of changes) {
		const { error: logError } = await supabase.from('data_version').insert({
			table_name: tableName,
			record_id: existingRecord.id,
			external_id: existingRecord.external_id,
			changed_column: change.column,
			old_value: change.oldValue,
			new_value: change.newValue,
		});

		if (logError) {
			console.error('Error logging change:', logError);
			//::TODO
			throw logError;
		}
	}

	return { error: null, changesLogged: true };
}

export { updateAndLogChanges };
