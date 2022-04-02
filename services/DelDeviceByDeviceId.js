import API, { httsStatus, getError } from './api';
import InternalServerError  from './Errors/InternalServer';

const DelDeviceByDeviceId = async (endDeviceID) => {
    try{
        const api = await API();
        return await api.delete(`UserUi/DelDeviceByDeviceId?id=${endDeviceID}`);
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

export default DelDeviceByDeviceId