import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Picker,
  TextInput,
  Alert,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
import _, { sortedLastIndex } from "lodash"
import { useFonts } from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import manual from '../assets/manual.png'
import save from '../assets/save.png'
import saveDisabled from '../assets/saveDisabled.png'

import GetAllWaterTank from '../services/GetAllWaterTank'
import PostNewDevice from '../services/PostNewDevice'

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


export function SetNewDevice({ navigation }) {


  const [loaded] = useFonts({
    nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
    nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
  });
  const [selectedWaterTank, setSelectedWaterTank] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [waterTankName, setWaterTankName] = useState("");

  const [listWaterTankList, setListWaterTankList] = useState([]);
  const [listWaterTankLoading, setListWaterTankLoading] = useState(true);
  const [listWaterTankError, setListWaterTankError] = useState({});

  const [newDeviceResponse, setNewDeviceResponse] = useState({});
  const [newDeviceLoading, setNewDeviceLoading] = useState(true);
  const [newDeviceError, setNewDeviceError] = useState({});

  const [loggedUser, setLoggedUser] = useState("");
  const [disableSave, setDisableSave] = useState(true);


  useEffect(() => {
    retrieveLoggedUser();
    handleGetAllWaterTank();
  }, [])

  const handleGetAllWaterTank = async () => {
    try {
      setListWaterTankLoading(true);

      const [waterTank] = await Promise.all([
        GetAllWaterTank()
      ]);

      setListWaterTankList(waterTank.data)
    }
    catch (err) {
      Alert.alert("Error Message: ", err.message);
      setListWaterTankError(err);
    }
    finally {
      setListWaterTankLoading(false);
    }
  }

  const handlePostNewDevice = async () => {
    try {
      setNewDeviceLoading(true);
      let formData = new FormData();
      formData.append("userId", loggedUser);
      formData.append("endDeviceID", deviceId);
      formData.append("waterTankId", selectedWaterTank.waterTankId );
      formData.append("waterTankName", waterTankName);

      const [newDevice] = await Promise.all([
        PostNewDevice(formData)
      ]);

      setNewDeviceResponse(newDevice.data)

      Keyboard.dismiss()
      Alert.alert("Sucesso", "Novo dispositivo salvo")

      navigation.push('Devices');



    }
    catch (err) {
      if(err.message === "Request failed with status code 400"){
        Alert.alert("Error Message: ", "Dispositivo ID ja utilizado, por favor digite outro ID do dispositivo");
      }
      if(err.message === "Request failed with status code 404"){
        Alert.alert("Error Message: ", "Dispositivo não encontrado, certifique-se que digitou corretamente o ID, tente novamente");
      }
      else{
        Alert.alert("Error Message: ", err.message);
      }
      setNewDeviceError(err);
    }
    finally {
      setNewDeviceLoading(false);
    }
  }

  // useEffect(() => {
  //   console.log(selectedWaterTank)
  // }, [selectedWaterTank])

  useEffect(() => {
    if (waterTankName.length > 0 && deviceId.length > 0 && selectedWaterTank) {
      setDisableSave(false);
    }
    else {
      setDisableSave(true);

    }
  }, [waterTankName, deviceId, selectedWaterTank])



  const onChangeDeviceIdInput = (inputString) => {
    setDeviceId(inputString);
  }

  const onChangeNameInput = (inputString) => {
    setWaterTankName(inputString);
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

  const showWaterTankOptions = (
    listWaterTankList.map((s, i) => { return <Picker.Item key={i} value={s} label={`${s.brand}: ${s.theoVolume} L`} /> })
  )

  // React.useEffect(console.log("ASDASDASDASD"))
  return (
    <Background>

      <View style={styles.container}>

        <TopBar>
          <ArrowIcon>
            <TouchableOpacity
              onPress={ () => navigation.push('Devices')}
            >
              <Image source={backArrow}></Image>
            </TouchableOpacity>
          </ArrowIcon>
          <TopBarText>Novo Dispositivo</TopBarText>

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
            value={waterTankName}
            placeholder="nome"
            keyboardType="default"
          />
        </InputView>

        {!listWaterTankLoading
          ? (
            <InputView>
              <LabelText>Selecione a caixa d'água</LabelText>
              <Picker
                selectedValue={selectedWaterTank}
                style={{ height: 50, width: 150, border: 10 }}
                onValueChange={(itemValue, itemIndex) => setSelectedWaterTank(itemValue)}
                mode={"dropdown"}
              >
                <Picker.Item label="" value="" />
                {showWaterTankOptions}
              </Picker>
            </InputView>
          )
          : (
            <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
          )
        }


        <ButtonView>
          <TouchableOpacity
            onPress={() => navigation.push('SetWatertankMeasures')}>
            <Image source={manual}></Image>
          </TouchableOpacity>
        </ButtonView>


        {!disableSave
          ? (
            <ButtonView>
              <TouchableOpacity
                onPress={handlePostNewDevice}
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
