import API, { httsStatus, getError } from './api';
import InternalServerError  from './Errors/InternalServer';

const PatchUsersAndDevicesById = async (formObject) => {
    try{
        const api = await API();
        return await api.patch(`UserUi/PatchUsersAndDevicesById`, formObject);
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

export default PatchUsersAndDevicesById