import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Picker, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
import _, { sortedLastIndex } from "lodash"
import { useFonts } from 'expo-font'
import AsyncStorage  from '@react-native-async-storage/async-storage';

import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import manual from '../assets/manual.png'
import save from '../assets/save.png'


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

  align-items: center;
`;

const ButtonView=  styled.View`
  top: 50px;
  margin: 10px;
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

// const storeData = async () => { 
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



export function SetWatertankMeasures( {navigation} ) {

  
  const [loaded] = useFonts({
    nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
    nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
  });
  const [selectedDevice ,setSelectedDevice] = useState("");
  const [deviceId ,setDeviceId] = useState("");
  const [deviceName ,setDeviceName] = useState("");
  
 
//   useEffect(() => {
//     storeData()
//  }, [])

//   useEffect(() => {
//     setSelectedDevice(retrieveData());
//   }, [])


  useEffect(() => {
    console.log(selectedDevice)
  }, [selectedDevice])


    const onChangeDeviceIdInput = (inputString) => {
        setDeviceId(inputString);   
    }

    const onChangeNameInput = (inputString) => {
        setDeviceName(inputString);   
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
            <TopBarText>Configuração Manual</TopBarText>
              
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
            <LabelText>ID do dispositivo</LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeDeviceIdInput}
                value={deviceId}
                placeholder="id"
                keyboardType="default"
            />          
            </InputView>

            <InputView>
            <LabelText>Nome </LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeNameInput}
                value={deviceId}
                placeholder="nome"
                keyboardType="default"
            />          
            </InputView>

            <InputView>
            <LabelText>Altura da caixa </LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeNameInput}
                value={deviceId}
                placeholder="nome"
                keyboardType="default"
            />          
            </InputView>


            <InputView>
            <LabelText>Largura da caixa </LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeNameInput}
                value={deviceId}
                placeholder="nome"
                keyboardType="default"
            />          
            </InputView>

            <InputView>
            <LabelText>Capacidade em litros </LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeNameInput}
                value={deviceId}
                placeholder="nome"
                keyboardType="default"
            />          
            </InputView>

          <ButtonView>
            <TouchableOpacity 
              onPress={() => navigation.navigate('SetNewDevice')}>
              <Image source={save}></Image>                                   
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
