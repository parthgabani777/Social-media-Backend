export function responseDataSerialize(data: any[] | {}) {
    return {
        ...data,
    };
}

export function responseErrorSerialize(error: any[]) {
    return {
        errors: [...error],
    };
}
