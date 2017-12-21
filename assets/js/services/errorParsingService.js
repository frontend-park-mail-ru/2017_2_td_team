class ErrorParsingService {
    constructor() {
        this.errorTypeHandlers = new Map([
            ['incorrect_request_data', (err) => this.parseIncorrectDataError(err)],
            ['authorization_error', (err) => this.parseAuthError(err)],
            ['try_again_error', (err) => this.parseTryAgainError(err)]
        ]);
    }

    parseError(err) {
        const handler = this.errorTypeHandlers.get(err.type);
        if (!handler) {
            return null;
        }
        return handler(err);
    }

    parseIncorrectDataError(err) {
        return [
            err.incorrectRequestDataErrors.map(error => error.description),
            err.incorrectRequestDataErrors.map(error => error.fieldName)
        ];
    }

    parseAuthError(err) {
        return [
            err.authorizationError.description,
            err.authorizationError.path,
        ];
    }

    parseTryAgainError(err) {
        return [
            err.tryAgainError.message
        ];
    }
}

const apiErrorParser = new ErrorParsingService();
export default apiErrorParser;
