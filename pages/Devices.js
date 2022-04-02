import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Picker, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
import _, { sortedLastIndex } from "lodash"
import { useFonts } from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import newDevice from '../assets/newDevice.png'
import deleteDevice from '../assets/deleteDevice.png'

import GetAllDevicesByUserId from '../services/GetAllDevicesByUserId'
import DelDeviceByDeviceId from '../services/DelDeviceByDeviceId'


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

const ButtonView = styled.View`
  top: 300px;
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

  const [selectedDevice, setSelectedDevice] = useState({});

  const [devicesList, setDevicesList] = useState([]);
  const [devicesListLoading, setDevicesListLoading] = useState(true);
  const [devicesListError, setDevicesListError] = useState({});

  const [deleteDeviceResponse, setDeleteDeviceResponse] = useState([]);
  const [deleteDeviceResponseLoading, setDeleteDeviceLoading] = useState(true);
  const [deleteDeviceResponseError, setDeleteDeviceError] = useState({});



  useEffect(() => {
      retrieveLoggedUser();
  }, []);

  useEffect(() => {
    handleGetAllDevicesByUserId();
  }, [loggedUser]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveLoggedUser();
    });
    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    retrieveDevicecSelected();
  }, [])

  const handleGetAllDevicesByUserId = async () => {
    if(loggedUser){
      try {
        setDevicesListLoading(true);
          const [devicesList] = await Promise.all([
            GetAllDevicesByUserId(loggedUser)
          ]);
    
          setDevicesList(devicesList.data)

      }
      catch (err) {
        if(err.message === "Request failed with status code 404"){
          handleDeviceListNotFound();
        }else{
          Alert.alert("Error Message: ", err.message);
        }
        setDevicesListError(err);
      }
      finally {
        setDevicesListLoading(false);
      }
    }
  };

  const handleDelDevice = async () => {
    console.log("selectedDevice: ", selectedDevice)
    console.log("selectedDevice.endDeviceID: ", selectedDevice.endDeviceID)
    if(selectedDevice.endDeviceID){
      try {
        setDeleteDeviceLoading(true);
          const [deleteResponse] = await Promise.all([
            DelDeviceByDeviceId(selectedDevice.endDeviceID)
          ]);
    
          setDeleteDeviceResponse(deleteResponse.data)

      }
      catch (err) {
          Alert.alert("Error Message: ", err.message);
          setDeleteDeviceError(err);
      }
      finally {
        setDeleteDeviceLoading(false);
      }
    }
  }

  const handleDeviceListNotFound = () => {
    Alert.alert("Nenhum dispositivo não encontrado", `Por favor, cadastre novo dispositivo`);
    navigation.navigate('SetNewDevice');
    // setTimeout(() => {navigation.navigate('SetNewDevice')}, 2000);      
  }

  const handleSelectDevice = (itemValue, itemIndex) => {
    setSelectedDevice(itemValue);
    storeSelectedDevice(itemValue);
  }

  const retrieveLoggedUser = async () => {
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
    }
  };

  const handleUserNotLogged = () => {
    Alert.alert("Usuario nao registrado", `Por favor insira o usuário ID`);
    navigation.navigate('Login');
    // setTimeout(() => {navigation.navigate('SetNewDevice')}, 2000);      
  }

  const retrieveDevicecSelected = async () => {
    // try {
    //   const valueString = await AsyncStorage.getItem('@deviceSelected_API');
    //   const value = JSON.parse(valueString);
    //   setSelectedDevice(value)
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const storeSelectedDevice = async (item) => {
    try {
      await AsyncStorage.setItem('@deviceSelected_API', JSON.stringify(item));
      Alert.alert("Sucesso", "Dispositivo selectionado com sucesso")
    } catch (error) {
      console.log(error);
    }
  };



  const showDeviceList = (
    devicesList.map((s, i) => { return <Picker.Item key={i} value={s} label={s.waterTankName} /> })
  )

  const [loaded] = useFonts({
    nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
    nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
  });

  if (!loaded) {
    return null
  }


  // React.useEffect(console.log("ASDASDASDASD"))
  return (
    <Background>
      <View style={styles.container}>
        <TopBar>
          <ArrowIcon>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
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
            <TouchableOpacity onPress={() => navigation.navigate('HistoryLevelBatPage')}>
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
                  onValueChange={handleSelectDevice}
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

        <ButtonView>
          <TouchableOpacity
            onPress={() => navigation.navigate('SetNewDevice')}>
            <Image
              style={{ marginBottom: 20 }}
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
