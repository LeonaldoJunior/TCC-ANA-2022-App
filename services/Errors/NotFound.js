export default class NotFoundError {
    /**
     * A not found error signified by an API request that receives an HTTP 404 error code
     * @param {string} message Description of the error.
     */

    constructor(message){
        this.name = "NotFoundError";
        this.message = message || "";
        this.stack = new Error().stack;
    }
}