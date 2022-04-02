import API, { httsStatus, getError } from './api';
import InternalServerError  from './Errors/InternalServer';

const GetUserbyID = async (userId) => {
    try{
        const api = await API();
        return await api.get(`UserUi/GetUserbyId?id=${userId}`);
    }
    catch(err){
        if(err.response){
            if(err.response === httsStatus.InternalServerError){
                throw new InternalServerError();
            }
        }
        throw getError(err);
    }
}

export default GetUserbyID