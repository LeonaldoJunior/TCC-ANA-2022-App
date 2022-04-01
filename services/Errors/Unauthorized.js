export default class UnauthorizedError {
    /**
     * A Unauthorized request error signified by an API request that receives an HTTP 401 error code
     * @param {string} message Description of the error.
     */

    constructor(message){
        this.name = "UnauthorizedError";
        this.message = message || "";
        this.stack = new Error().stack;
    }
}