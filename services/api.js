import axios from "axios";

export default async function createAPI(){
    try{
        return axios.create({
            // baseURL: `https://tccana-backend.azurewebsites.net/`,
            baseURL: `https://fdbd-2804-718c-501-a851-5501-869a-7fe5-b9d.ngrok.io/api/`,
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
        return new Error(err.response.data.message);x   
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