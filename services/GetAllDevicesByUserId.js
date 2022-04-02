import API, { httsStatus, getError } from './api';
import InternalServerError  from './Errors/InternalServer';
import NotFound  from './Errors/NotFound';

const GetAllDevicesByUserId = async (userId) => {
    try{
        const api = await API();
        return await api.get(`UserUi/GetAllDevicesByUserId?id=${userId}`);
    }
    catch(err){
        if(err.response){
            if(err.response === httsStatus.InternalServerError){
                throw new InternalServerError();
            }
            if(err.response === httsStatus.NotFound){
                throw new Notfound();
            }
        }
        throw getError(err);
    }
}

export default GetAllDevicesByUserId