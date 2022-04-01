import API, { httsStatus, getError } from './api';
import InternalServerError  from './Errors/InternalServer';

const GetCaixasDAgua = async () => {
    try{
        const api = await API();
        return await api.get(`CaixaAgua\\GetAll`);
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

export default GetCaixasDAgua