import axios from "axios";

export default async function createAPI(){
    try{
        return axios.create({
            baseURL: `https://tccana-backend.azurewebsites.net/api/`,
            // baseURL: `https://6c12-2001-1284-f016-640a-151e-7f4e-1541-5ce7.ngrok.io/api/`,
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