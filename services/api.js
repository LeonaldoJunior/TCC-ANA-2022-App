import axios from "axios";

export default async function createAPI(){
    try{
        return axios.create({
            baseURL: `http://tccana-backend.azurewebsites.net/api/`,
            // baseURL: `https://a030-2804-f24-c1d5-500-7ca2-29cb-7cb3-65c3.ngrok.io/api/`,
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