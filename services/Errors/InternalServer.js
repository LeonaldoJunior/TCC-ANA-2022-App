export default class InternalServerError {
    /**
     * An internal server error signified by an API request that receives an HTTP 500 error code
     * @param {string} message Description of the internal server error.
     */

    constructor(message){
        this.name = "InternalServerError";
        this.message = message || "An unexpected error occured, please try again later";
        this.stack = new Error().stack;
    }
}