import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Picker, Alert, ActivityIndicator, TextInput,} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import _, { sortedLastIndex } from "lodash"
import { useFonts } from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import newDevice from '../assets/newDevice.png'
import deleteDevice from '../assets/deleteDevice.png'

import GetAllDevicesByUserId from '../services/GetAllDevicesByUserId'
import DelDeviceByDeviceId from '../services/DelDeviceByDeviceId'
import PatchUsersAndDevicesById from '../services/PatchUsersAndDevicesById'


const Background = ({ children }) => {
  return (
    <LinearGradient
      colors={['#04A1FF', '#8BD3FF', '#FFFFFF']}
      style={{
        flex: 1,

      }}
    >
      {children}
    </LinearGradient>
  )
}

const TopBar = styled.View`
  flex-direction: row;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 98px;
  background: #0052B9;
  align-items: center;
  justify-content: space-between; 
`;

const InputView = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 98px;
  align-items: center;
`;

const SelectedDevicetView = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 98px;
  align-items: center;
  margin-top: 150px;
`;

const ButtonView = styled.View`
  top: 200px;
`
const LabelText = styled.Text`
  font-style: normal;
  font-size: 18px;
  line-height: 22px;
  margin :20px;
`;

const TopBarText = styled.Text`
  font-family: nunitoBold;
  font-style: normal;
  font-size: 30px;
  line-height: 55px;
  align-items: center;
  text-align: center;
  color: #FFFFFF;
  top: 10px;
  right: 10px;
`;
const BatIcon = styled.View`
  right: 10px
  top: 10px;
`;
const ArrowIcon = styled.View`  
  left: 10px
  top: 12px;
`;

export function Devices({ navigation }) {
  
  const [loggedUser, setLoggedUser] = useState("");
  const [loggedUserLoading ,setLoggedUserLoading] = useState(true);



  const [devicesList, setDevicesList] = useState([]);
  const [devicesListLoading, setDevicesListLoading] = useState(true);
  const [devicesListError, setDevicesListError] = useState({});

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDeviceLoading, setSelectedDeviceLoading] = useState(true);
  const [selectedDeviceError, setSelectedDeviceError] = useState({});

  const [deleteDeviceResponse, setDeleteDeviceResponse] = useState([]);
  const [deleteDeviceResponseLoading, setDeleteDeviceLoading] = useState(true);
  const [deleteDeviceResponseError, setDeleteDeviceError] = useState({});


  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveLoggedUser();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
      retrieveLoggedUser();
  }, []);

  useEffect(() => {
    if(!loggedUserLoading){
      handleGetAllDevicesByUserId();
    }
  }, [loggedUser, loggedUserLoading]);

  useEffect(() => {
    if(!devicesListLoading){
      handleSelectedDevice();
    }
  }, [devicesList, devicesListLoading]);

  const handleSelectedDevice = () =>{
    let foundDeviceSelected = devicesList.find(device => device.userDevice.isSelected == true);
    if(foundDeviceSelected){
      setSelectedDevice(foundDeviceSelected);
    }
    
  }

  useEffect(()=>{
    if(selectedDevice && selectedDevice.userDevice && selectedDevice.userDevice.waterTankName){
      setSelectedDeviceLoading(false);
    }
  },[selectedDevice])


  const handleGetAllDevicesByUserId = async () => {
    setDevicesListLoading(true);
    try {
        const [devicesList] = await Promise.all([
          GetAllDevicesByUserId(loggedUser)
        ]);
  
        setDevicesList(devicesList.data)

    }
    catch (err) {
      if(err.message === "Request failed with status code 404"){
        handleDeviceListNotFound();
      }else if(err.message === "Request failed with status code 502"){
        Alert.alert("Message ", "Desculpe estamos tendo problemas com a conexão, certifique-se que está conectado a internet e tente novamente!");
      }else{
        Alert.alert("Mensagem de Erro: ", err.message);
      }
      setDevicesListError(err);
    }


    finally {
      setDevicesListLoading(false);
    }
    
  };

  const handleDelDevice = async () => {
    if(selectedDevice.userDevice.endDeviceID){
      try {
        setDeleteDeviceLoading(true);
          const [deleteResponse] = await Promise.all([
            DelDeviceByDeviceId(selectedDevice.userDevice.endDeviceID)
          ]);    
          setDeleteDeviceResponse(deleteResponse.data)
          navigation.push('Devices');
      }
      catch (err) {
        if(err.message === "Request failed with status code 404"){
          Alert.alert("Mensagem: ", "Desculpe não foi encontrado o dispositivo");
        }else if(err.message === "Request failed with status code 502"){
          Alert.alert("Mensagem ", "Erro no servidor");
        }else{
          Alert.alert("Mensagem de Erro: ", err.message);
        }
        setDeleteDeviceError(err);
      }



      finally {
        setDeleteDeviceLoading(false);
      }
    }
  }

  const handleDeviceListNotFound = () => {
    Alert.alert("Nenhum dispositivo encontrado", `Por favor, cadastre um novo dispositivo.`);
    navigation.push('SetNewDevice');
    // setTimeout(() => {navigation.navigate('SetNewDevice')}, 2000);      
  }

  const handlePatchUsersAndDevicesById = async (itemValue, itemIndex) => {
      try {
        setSelectedDeviceLoading(true);

        let formData = new FormData();
        formData.append("userId", loggedUser);
        formData.append("usersAndDevicesId", itemValue.userDevice.usersAndDevicesId);

        const [selectedDeviceResp] = await Promise.all([
          PatchUsersAndDevicesById(formData)
        ]);

        navigation.push('Devices');

      }
      catch (err) {
        if(err.message === "Request failed with status code 404"){
          Alert.alert("Message: ", "Desculpe não foi encontrado o dispositivo");
        }else if(err.message === "Request failed with status code 502"){
          Alert.alert("Message ", "Desculpe estamos tendo problemas com a conexão, certifique-se que está conectado a internet e tente novamente!");
        }else{
          Alert.alert("Mensagem de Erro: ", err.message);
        }
        setSelectedDeviceError(err);
      }


      finally {
        setSelectedDeviceLoading(false);
      }

  };

  const retrieveLoggedUser = async () => {
    setLoggedUserLoading(true);
    try {
      const valueString = await AsyncStorage.getItem('@loggedUserId');
      const value = JSON.parse(valueString);

      if (value !== null) {
        setLoggedUser(value);
      } else {
        handleUserNotLogged();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ",error);
    }
    finally {
      setLoggedUserLoading(false);
    }
  };

  const handleUserNotLogged = () => {
    Alert.alert("Usuário não registrado.", `Por favor insira seu identificador único.`);
    navigation.push('Login');
    // setTimeout(() => {navigation.navigate('SetNewDevice')}, 2000);      
  }

  const showDeviceList = (
    devicesList.map((s, i) => { return <Picker.Item key={i} value={s} label={s.userDevice.waterTankName} /> })
  )

  const [loaded] = useFonts({
    nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
    nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
  });

  if (!loaded) {
    return null
  }

  return (
    <Background>
      <View style={styles.container}>
        <TopBar>
          <ArrowIcon>
            <TouchableOpacity
              onPress={() => navigation.push('MyLevelPage')}
            >
              <Image source={backArrow}></Image>
            </TouchableOpacity>
          </ArrowIcon>
          <TopBarText>Dispositivos</TopBarText>

          <BatIcon
            style={{
              transform: [
                { scale: .8 }
              ]
            }}
          >
            <TouchableOpacity onPress={() => navigation.push('HistoryLevelBatPage')}>
              <Image source={Battery}></Image>
            </TouchableOpacity>
          </BatIcon>
        </TopBar>
        <InputView>
          {!devicesListLoading 
          ?(
              <InputView>
                <LabelText>Selecione seu dispositivo</LabelText>
                <Picker
                  selectedValue={selectedDevice}
                  style={{ height: 50, width: 150, border: 10 }}
                  onValueChange={handlePatchUsersAndDevicesById}
                  mode={"dropdown"}
                >
                  <Picker.Item label="" value="" />
                  {showDeviceList}
                </Picker>
              </InputView>
          )
          : (
            <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
          )
          }
        </InputView>

        <InputView>
          {!selectedDeviceLoading && selectedDevice
          && (
            <SelectedDevicetView>
              <LabelText>
                Dispositivo selecionado: {selectedDevice.userDevice.waterTankName} {"\n"}
                Marca: {selectedDevice.waterTank.brand}{"\n"}
                Volume: {selectedDevice.waterTank.theoVolume} L{"\n"}
                Raio da base: {selectedDevice.waterTank.baseRadius}m{"\n"}
                Raio do topo: {selectedDevice.waterTank.topRadius}m{"\n"}
                Altura: {selectedDevice.waterTank.height}m{"\n"}
              </LabelText>
            </SelectedDevicetView>

          )
          }
        </InputView>

        <ButtonView>
          <TouchableOpacity
            onPress={() => navigation.push('SetNewDevice')}>
            <Image
              style={{ marginBottom: 5 }}
              source={newDevice}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelDevice}>
            <Image
              source={deleteDevice}></Image>

          </TouchableOpacity>
        </ButtonView>

        <StatusBar style="auto" />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
