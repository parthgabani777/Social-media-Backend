import mongoose from "mongoose";
import { ErrorRequestHandler } from "express";
import { responseErrorSerialize } from "./serialize";

export class HttpException extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    let status = 400;
    let messages = [];

    switch (error.constructor) {
        case mongoose.Error.ValidationError:
            status = 409;
            for (let field in error.errors) {
                let message = {
                    field: field,
                    message: error.errors[field].message,
                };
                messages.push(message);
            }
            break;
        case mongoose.Error.CastError:
            status = 400;
            messages.push(`Cannot cast ${error.path} to ${error.kind}`);
            break;
        case HttpException:
            status = error.statusCode;
            messages.push({ messages: error.message });
            break;
        case Error:
            messages.push({ message: error.message });
        default:
            messages.push({ message: String(error) });
    }

    // if (error instanceof mongoose.Error.ValidationError) {
    //     status = 409;
    //     for (let field in error.errors) {
    //         let message = {
    //             field: field,
    //             message: error.errors[field].message,
    //         };
    //         messages.push(message);
    //     }
    // } else if (error instanceof HttpException) {
    //     status = error.statusCode;
    //     messages.push({ messages: error.message });
    // } else if (error instanceof Error) {
    //     messages.push({ message: error.message });
    // } else {
    //     messages.push({ message: String(error) });
    // }
    const serializedError = responseErrorSerialize(messages);
    res.status(status).json(serializedError);
};
