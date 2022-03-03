import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Picker, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
import _, { sortedLastIndex } from "lodash"
import { useFonts } from 'expo-font'
import AsyncStorage  from '@react-native-async-storage/async-storage';

import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import newDevice from '../assets/newDevice.png'
import deleteDevice from '../assets/deleteDevice.png'


const Background = ({ children }) => {
  return(
    <LinearGradient
      colors={['#04A1FF','#8BD3FF','#FFFFFF']}
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

const ButtonView=  styled.View`
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

// const storeKey = "Devices"

// const storeSelectedDevice = async () => { 
//   try {
//     await AsyncStorage.setItem(storeKey, 'java');
//     await AsyncStorage.setItem(storeKey, 'css');
//     setflag(true);
//   } catch (error) {
//     // Error saving data
//   }
// }

// const retrieveData = async () => {
//   console.log("chamou retrieveData")

//   try {
//     const value = await AsyncStorage.getItem(storeKey);
//     if (value !== null) {

//       // We have data!!
//       console.log(value);

//       return value;
//     }
//    } catch (error) {
//     console.log(error)
//     return null;
//      // Error retrieving data  
//    }
// }


export function Devices( {navigation} ) {

  const [selectedDevice ,setSelectedDevice] = useState({});
  const [devicesList ,setDevicesList] = useState([]);
  
 
//   useEffect(() => {
//     storeSelectedDevice()
//  }, [])

//   useEffect(() => {
//     setSelectedDevice(retrieveData());
//   }, [])


  // useEffect(() => {
  //   console.log(devicesList)
  // }, [devicesList])

  // React.useEffect(storeSelectedDevice)


  useEffect(() => {
    retrieveDevicesList();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveDevicesList();
    });
    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    retrieveDevicecSelected();
  },[])



  // useEffect(() => {
  //    devicesList.map((s,i) => console.log(s))

  // }, [devicesList]);
  

  const retrieveDevicesList = async () => {
    try {
      const valueString = await AsyncStorage.getItem('@deviceList_API');
      const value = JSON.parse(valueString);
      if(value.length > 0){
        setDevicesList(value);
      }else{
        handleDeviceListNotFound();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const retrieveDevicecSelected = async () => {
    try {
      const valueString = await AsyncStorage.getItem('@deviceSelected_API');
      const value = JSON.parse(valueString);
      setSelectedDevice(value)      
    } catch (error) {
      console.log(error);
    }
  };

  const storeSelectedDevice = async (item) => {
    try {
      await AsyncStorage.setItem('@deviceSelected_API', JSON.stringify(item));
      Alert.alert("Sucesso", "Dispositivo selectionado com sucesso")
    } catch (error) {
      console.log(error);
    }
  };

  const storeDeviceList = async (item) => {
    try {
      await AsyncStorage.setItem('@deviceList_API', JSON.stringify(item));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeviceListNotFound = () => {
    Alert.alert("Nenhum dispositivo não encontrado", `Por favor, cadastre novo dispositivo`);
    navigation.navigate('SetNewDevice');
    // setTimeout(() => {navigation.navigate('SetNewDevice')}, 2000);      
  }

  
  const showDeviceList = (
    devicesList.map((s,i) => 
    {return <Picker.Item key={i} value={s} label={s.deviceName}/>})
  )

  const handleSelectDevice = (itemValue, itemIndex) =>{
    // console.log(itemValue.selectedWaterTank.marca)
    setSelectedDevice(itemValue);
    storeSelectedDevice(itemValue);
  }

  const handleDelDevice = () =>{
    let newdeviceList = devicesList.filter((device)=> { return device.deviceName !== selectedDevice.deviceName})   

    Alert.alert("Sucesso", `Voce removeu o dispositivo ${selectedDevice.deviceName}`)

    setDevicesList(newdeviceList) 
    storeDeviceList(newdeviceList);
    retrieveDevicesList();

  }

  const [loaded] = useFonts({
    nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
    nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
  });

  if(!loaded){
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
                  { scale: .8  }
                ]
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate('HistoryLevelBatPage')}>
                <Image source={Battery}></Image>                                   
              </TouchableOpacity>
            </BatIcon>
          </TopBar>
          <InputView>
            {devicesList.length > 0 
              && (
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
            )}
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
