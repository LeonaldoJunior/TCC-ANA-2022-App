import axios from "axios";

export default async function createAPI(){
    try{
        return axios.create({
            // baseURL: `http://tccana-backend.azurewebsites.net/api/`,
            baseURL: `https://d398-2001-1284-f016-57eb-9808-34d2-946f-dc33.ngrok.io/api/`,
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

export const httpsStatus = Object.freeze({
    NoContent: 204,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 502
})