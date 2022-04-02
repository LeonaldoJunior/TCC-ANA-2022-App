import axios from "axios";

export default async function createAPI(){
    try{
        return axios.create({
            // baseURL: `https://tccana-backend.azurewebsites.net/`,
            baseURL: `https://5b1a-2001-1284-f016-4ecb-e5da-f353-1ece-1b44.ngrok.io/api/`,
            headers: {
                "Content-Type": "application/json"
            },
        });
    }
    catch(error){
        console.log(error);
    }
}

export const getError = (err) => {
    if(err && err.response && err.response.data && err.response.data.message){
        return new Error(err.response.data.message);
    }
    return new Error(err.message)
};

export const httsStatus = Object.freeze({
    NoContent: 204,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 500
})