import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Picker, TextInput, Alert, Keyboard } from 'react-native';
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
import GetCaixasDagua from '../services/GetCaixasDaguaApi'

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
  top: 30px;
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



export function SetNewDevice( {navigation} ) {

  
  const [loaded] = useFonts({
    nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
    nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
  });
  const [selectedWaterTank ,setSelectedWaterTank] = useState("");
  const [deviceId ,setDeviceId] = useState("");
  const [deviceName ,setDeviceName] = useState("");
  const [listWaterTank ,setListWaterTank] = useState([]);
  
 
  useEffect(() => {
    GetCaixasDagua().then((x)=>{
      setListWaterTank(x)
    });
 }, [])



//  useEffect(() => {
//   console.log(listWaterTank)
//   console.log(listWaterTank.length)

//   // listWaterTank.map( (s, i) => {
//   //  console.log(s.capacidade)

//   // })

// }, [listWaterTank])

//   useEffect(() => {
//     setSelectedWaterTank(retrieveData());
//   }, [])


  useEffect(() => {
    console.log(selectedWaterTank)
  }, [selectedWaterTank])


    const onChangeDeviceIdInput = (inputString) => {
        setDeviceId(inputString);   
    }

    const onChangeNameInput = (inputString) => {
      setDeviceName(inputString);   
    }


    const showWaterTankOptions = (
      listWaterTank.map((s,i) => 
      {return <Picker.Item key={i} value={s.caixaId} label={`${s.marca}: ${s.capacidade} L`}/>})
    )



    const saveDevice = async () =>{

      try{
        const oldDevices = await AsyncStorage.getItem('@deviceList_API')

        let newDevices = JSON.parse(oldDevices);
        if( !newDevices ){
          newDevices = []
        }


        let deviceObj = {
          deviceName: deviceName,
          deviceId: deviceId,
          selectedWaterTank: selectedWaterTank
        }


        newDevices.push(deviceObj)

        await AsyncStorage.setItem('@deviceList_API', JSON.stringify(newDevices))     
        
        Keyboard.dismiss()
        Alert.alert("Sucesso", "Novo dispositivo salvo")

      }
      catch (e){
        console.log(e)
        Alert.alert(e);
      }
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
            <TopBarText>Novo Dispositivo</TopBarText>
              
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
            <TextInput
                onChangeText={onChangeDeviceIdInput}
                value={deviceId}
                placeholder="id"
                keyboardType="default"
            />          
          </InputView>

          <InputView>
            <LabelText>Nome do dispositivo </LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeNameInput}
                value={deviceName}
                placeholder="nome"
                keyboardType="default"
            />          
          </InputView>

              {listWaterTank.length > 0 
              && (
                <InputView>              
                <LabelText>Selecione a caixa d'água</LabelText>
                <Picker
                  selectedValue={selectedWaterTank}
                  style={{ height: 50, width: 150, border: 10 }}
                  onValueChange={(itemValue, itemIndex) => setSelectedWaterTank(itemValue)}
                  mode={"dropdown"}
                >
                  {showWaterTankOptions}                
                </Picker>
                </InputView>
              )}


          <ButtonView>
            <TouchableOpacity 
              onPress={() => navigation.navigate('SetWatertankMeasures')}>
              <Image source={manual}></Image>                                   
            </TouchableOpacity>
          </ButtonView>

          <ButtonView>
            <TouchableOpacity 
              onPress={saveDevice}>
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
