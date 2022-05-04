import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Picker, TextInput ,   Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import _, { sortedLastIndex } from "lodash"
import { useFonts } from 'expo-font'
import AsyncStorage  from '@react-native-async-storage/async-storage';

import PostNewWaterTank from '../services/PostNewWaterTank'

import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import manual from '../assets/manual.png'
import save from '../assets/save.png'
import saveDisabled from '../assets/saveDisabled.png'


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

export function SetWatertankMeasures( {navigation} ) {

  
  const [loaded] = useFonts({
    nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
    nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
  });
  const [selectedDevice ,setSelectedDevice] = useState("");

  const [waterTankBrand ,setWaterTankBrand] = useState("");
  const [waterTankBaseRadius ,setWaterTankBaseRadius] = useState("");
  const [waterTankTopRadius ,setWaterTankTopRadius] = useState("");
  const [waterTankHeight , setWaterTankHeight] = useState("");
  const [waterTankTheoVolume , setWaterTankTheoVolume] = useState("");

  const [disableSave , setDisableSave] = useState("");

  const [newWaterTankResponse, setNewWaterTankResponse] = useState({});
  const [newWaterTankLoading, setNewWaterTankLoading] = useState(true);
  const [newWaterTankError, setNewWaterTankError] = useState({});
  
 
//   useEffect(() => {
//     storeData()
//  }, [])

//   useEffect(() => {
//     setSelectedDevice(retrieveData());
//   }, [])


  useEffect(() => {
    console.log(selectedDevice)
  }, [selectedDevice])

  useEffect(() => {
    if (
      waterTankBrand.length > 0 
      && waterTankBaseRadius.length > 0 
      && waterTankTopRadius.length > 0 
      && waterTankHeight.length > 0 
      && waterTankTheoVolume.length > 0 
    )
    {
      setDisableSave(false);
    }
    else {
      setDisableSave(true);

    }
  }, [waterTankBrand, waterTankBaseRadius, waterTankTopRadius, waterTankHeight, waterTankTheoVolume])

  const onChangeBrandInput = (e) => {
    setWaterTankBrand(e);   
  }

  const onChangeBaseRadiusInput = (e) => {
    setWaterTankBaseRadius(e);   
  }

  const onChangeTopRadiusInput = (e) => {
    setWaterTankTopRadius(e);   
  }

  const onChangeHeightInput = (e) => {
    setWaterTankHeight(e);   
  }

  const onChangeTheoVolumeInput = (e) => {
    setWaterTankTheoVolume(e);   
  }


  const handlePostNewWaterTank = async () => {
    try {
      setNewWaterTankLoading(true);
      let formData = new FormData();
      formData.append("waterTankBrand", waterTankBrand);
      formData.append("waterTankBaseRadius", waterTankBaseRadius);
      formData.append("waterTankTopRadius", waterTankTopRadius );
      formData.append("waterTankHeight", waterTankHeight);
      formData.append("waterTankTheoVolume", waterTankTheoVolume);

      const [newWaterTank] = await Promise.all([
        PostNewWaterTank(formData)
      ]);

      setNewWaterTankResponse(newWaterTank.data)

      Keyboard.dismiss()
      Alert.alert("Sucesso", "Nava caixa registrada")

      navigation.push('Devices');



    }
    catch (err) {
      if(err.message === "Request failed with status code 502"){
        Alert.alert("Message ", "Desculpe estamos tendo problemas com a conexão, certifique-se que está conectado a internet e tente novamente!");
      }else{
        Alert.alert("Error Message: ", err.message);
      }
        setNewWaterTankError(err);
    }
    
    finally {
      setNewWaterTankLoading(false);
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
            <LabelText>Marca </LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeBrandInput}
                value={waterTankBrand}
                placeholder="nome"
                keyboardType="default"
            />     
            </InputView>

            <InputView>
            <LabelText>Altura da caixa </LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeHeightInput}
                value={waterTankHeight}
                placeholder="metros"
                keyboardType='numeric'
                />          
            </InputView>


            <InputView>
            <LabelText>Raio da base</LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeBaseRadiusInput}
                value={waterTankBaseRadius}
                placeholder="metros"
                keyboardType='numeric'
                />          
            </InputView>
            
            <InputView>
            <LabelText>Raio do topo </LabelText>
            {/* style={styles.input} */}
            <TextInput

                onChangeText={onChangeTopRadiusInput}
                value={waterTankTopRadius}
                placeholder="metros"
                keyboardType='numeric'
                />          
            </InputView>

            <InputView>
            <LabelText>Volume da caixa </LabelText>
            {/* style={styles.input} */}
            <TextInput
                onChangeText={onChangeTheoVolumeInput}
                value={waterTankTheoVolume}
                placeholder="metros"
                keyboardType='numeric'
                />          
            </InputView>



          {!disableSave
          ? (
            <ButtonView>
            <TouchableOpacity 
              onPress={handlePostNewWaterTank}
            >
              <Image source={save}></Image>                                   
            </TouchableOpacity>
          </ButtonView>
          ) : (
            <ButtonView>
              <Image source={saveDisabled}></Image>
            </ButtonView>
          )}


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
