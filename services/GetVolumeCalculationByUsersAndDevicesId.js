import API, { httpsStatus, getError } from './api';
import InternalServerError  from './Errors/InternalServer';
import NotFound  from './Errors/NotFound';
import BadRequest  from './Errors/NotFound';
import Unauthorized  from './Errors/NotFound';

const GetVolumeCalculationByUsersAndDevicesId = async (deviceId) => {
    try{
        const api = await API();
        return await api.get(`UserUi/GetVolumeCalculationByUsersAndDevicesId?id=${deviceId}`);
    }
    catch(err){
        if(err.response){
            if(err.response === httpsStatus.InternalServerError){
                throw new InternalServerError();
            }
            if(err.response === httpsStatus.NotFound){
                throw new NotFound();
            }
            if(err.response === httpsStatus.BadRequest){
                throw new BadRequest();
            }
            if(err.response === httpsStatus.Unauthorized){
                throw new Unauthorized();
            }
        }
        throw getError(err);
    }
}

export default GetVolumeCalculationByUsersAndDevicesId