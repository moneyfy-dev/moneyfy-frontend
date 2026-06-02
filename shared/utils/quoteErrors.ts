type QuoteFailureDetail = {
    insurerAlias?: string;
    insurer?: {
        name?: string;
    };
    error?: string;
    errorMessage?: string;
};

type QuoteErrorMessageOptions = {
    emptyPlansMessage: string;
    genericMessage: string;
    invalidJwtMessage: string;
};

const normalizeMessage = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

const getDetails = (error: unknown): QuoteFailureDetail[] => {
    const details = (error as { details?: unknown })?.details;
    return Array.isArray(details) ? details : [];
};

const getDetailReason = (detail: QuoteFailureDetail) =>
    normalizeMessage(`${detail.errorMessage || ''} ${detail.error || ''}`);

const hasOnlyInvalidJwtDetails = (details: QuoteFailureDetail[]) =>
    details.length > 0 && details.every((detail) => {
        const reason = getDetailReason(detail);
        return reason.includes('jwt') && reason.includes('invalido');
    });

export const getQuoteErrorMessage = (
    error: unknown,
    options: QuoteErrorMessageOptions
) => {
    const message = error instanceof Error ? error.message : '';
    const details = getDetails(error);

    return hasOnlyInvalidJwtDetails(details)
        ? options.invalidJwtMessage
        : message === 'No se encontraron planes disponibles'
            ? options.emptyPlansMessage
            : options.genericMessage;
};
