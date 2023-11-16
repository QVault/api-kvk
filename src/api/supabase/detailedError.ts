class DetailedError extends Error {
	constructor(message, detail) {
		super(message);
		this.detail = detail;
	}
}

export { DetailedError };
