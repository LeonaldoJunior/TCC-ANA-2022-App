export default class BadRequestError {
    /**
     * A bad request error signified by an API request that receives an HTTP 400 error code
     * @param {string} message Description of the error.
     */

    constructor(message){
        this.name = "BadRequestError";
        this.message = message || "";
        this.stack = new Error().stack;
    }
}