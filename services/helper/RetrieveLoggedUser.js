const RetrieveLoggedUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('@loggedUserId');
      const value = JSON.parse(valueString);

      if(value !== null){
        setLoggedUser(value);
        retrieveDevicecSelected();
      }else{
        handleUserNotLogged();
      }

      
    } catch (error) {
      console.log(error);
    }
};