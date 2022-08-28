export function responseDataSerialize(data: any[] | {}) {
    return {
        data: {
            ...data,
        },
    };
}

export function responseErrorSerialize(error: any[]) {
    return {
        errors: [...error],
    };
}
