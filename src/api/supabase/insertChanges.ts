function safeToString(value): string {
	return value === null || value === undefined ? '' : value.toString();
}

async function updateAndLogChanges(supabase, tableName, existingRecord, newData, mapDataToTable) {
	const changes = [];
	const newDataPrepared = mapDataToTable(newData);

	// Optimized change detection
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

	// Update operation with error handling
	try {
		const { error: updateError } = await supabase.from(tableName).update(newDataPrepared).eq('external_id', existingRecord.external_id);
		if (updateError) {
			throw updateError;
		}
	} catch (error) {
		console.error('Error updating record:', error);
		throw error;
	}

	// Bulk logging changes
	try {
		const logEntries = changes.map((change) => ({
			table_name: tableName,
			record_id: existingRecord.id,
			external_id: existingRecord.external_id,
			changed_column: change.column,
			old_value: change.oldValue,
			new_value: change.newValue,
		}));
		const { error: logError } = await supabase.from('data_version').insert(logEntries);
		if (logError) {
			console.error('Error logging changes:', logError);
			throw logError;
		}
	} catch (error) {
		console.error('Error during bulk logging:', error);
		throw error;
	}

	return { error: null, changesLogged: true };
}

export { updateAndLogChanges };
