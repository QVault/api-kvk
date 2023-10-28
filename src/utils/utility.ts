export function transformDoelstelling(doelstelling: string): {
	[key: string]: string[];
} {
	if (typeof doelstelling !== 'string') {
		throw new Error('Invalid doelstelling data');
	}

	const regex = /(\d+\..*?)(?=\d+\.|$)/gs;
	let match;
	const transformed: { [key: string]: string[] } = {};

	while ((match = regex.exec(doelstelling)) !== null) {
		const part = match[1].trim();
		const index = part.indexOf('.');
		const key = part.substring(index + 1, part.indexOf(',')).trim();
		const values = part
			.substring(part.indexOf(',') + 1)
			.split(',')
			.map((s) => s.trim());
		transformed[key] = values;
	}

	return transformed;
}

export function joinWithSpace(part1: any, part2: any): string {
	return [part1, part2].filter(Boolean).join(' ');
}
