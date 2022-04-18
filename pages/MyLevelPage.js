import { StatusBar } from 'expo-status-bar';
import React, { Children, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
import backArrow from '../assets/backArrow.png'
import anaIcon from '../assets/anaIcon.png'
import { useFonts } from 'expo-font'
import AsyncStorage  from '@react-native-async-storage/async-storage';

import GetSelectedDeviceByUserId from '../services/GetSelectedDeviceByUserId'
import GetVolumeCalculationByUsersAndDevicesId from '../services/GetVolumeCalculationByUsersAndDevicesId'

import Battery from './Components/Battery';

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
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 98px;
    background: #0052B9;
    justify-content: space-between;
    align-items: center;

`;
const TopBarText = styled.Text`
    font-family: nunitoBold;
    font-style: normal;
    font-size: 30px;
    line-height: 55px;
    color: #FFFFFF;
    top: 10px;  
    top: 10px;
    right: 10px;
`;
const BatIcon = styled.View`
    top: 10px;
    right: 10px

`;

const BatIconLoading = styled.View`
    top: 50px;
    right: 10px
`;

const AnaIcon = styled.View`
    top: 12px;
    left: 10px
`;

const LevelText = styled.Text`    
    font-family: nunitoBold;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    text-align: center;
    color: #FFFFFF;
    margin-top: 20px;
    height: 150px;
`;

const ActivityIndicatorDiv = styled.View`
    height: 150px;
    margin-top: 30px;
`;

// Talvez abaixar mais a caixa dagua verificar depois
const WaterTank = styled.View`
    justify-content: center;
    align-items: center; 
    margin-top: 30px;
    height: 200px;

`;

const Buttons = styled.View`    
    justify-content: center;
    align-items: center; 
`;

let interval;


export function MyLevelPage( {navigation} ){

    const [levelImage, setLevelImage] = useState(require("../assets/waterTank0.png"));
    const [loggedUser ,setLoggedUser] = useState("");
    const [loggedUserLoading ,setLoggedUserLoading] = useState(true);


    const [selectedDevice ,setSelectedDevice] = useState({});
    const [selectedDeviceLoading, setSelectedDeviceLoading] = useState(true);
    const [selectedDeviceError, setSelectedDeviceError] = useState({});

    const [currentVolumeAndBatteryLevel ,setCurrentVolumeAndBatteryLevel] = useState({});
    const [currentVolumeAndBatteryLevelLoading, setCurrentVolumeAndBatteryLevelLoading] = useState(true);
    const [currentVolumeAndBatteryLevelError, setCurrentVolumeAndBatteryLevelError] = useState({});

    const MINUTE_MS = 60000;

    
    const images = {
        100:  require("../assets/waterTank100.png"),
        95:  require("../assets/waterTank95.png"),
        90:  require("../assets/waterTank90.png"),
        85:  require("../assets/waterTank85.png"),
        80:  require("../assets/waterTank80.png"),
        75:  require("../assets/waterTank75.png"),
        70:  require("../assets/waterTank70.png"),
        65:  require("../assets/waterTank65.png"),
        60:  require("../assets/waterTank60.png"),
        55:  require("../assets/waterTank55.png"),
        50:  require("../assets/waterTank50.png"),
        45:  require("../assets/waterTank45.png"),
        40:  require("../assets/waterTank40.png"),
        35:  require("../assets/waterTank35.png"),
        30:  require("../assets/waterTank30.png"),
        25:  require("../assets/waterTank25.png"),
        20:  require("../assets/waterTank20.png"),
        15:  require("../assets/waterTank15.png"),
        10:  require("../assets/waterTank10.png"),
        5:  require("../assets/waterTank5.png"),
        0:  require("../assets/waterTank0.png")
    }

    // useEffect(()=>{
    //     console.log("DO USEEFFECT currentVolumeAndBatteryLevel")
    //     console.log(currentVolumeAndBatteryLevel)
    // },[currentVolumeAndBatteryLevel])


    // useEffect(()=>{
    //     console.log("DO USEEFFECT selectedDevice")
    //     console.log(selectedDevice)
    // },[selectedDevice])


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            retrieveLoggedUser();
        });
        return unsubscribe;
      }, [navigation]);

    useEffect(() => {
        retrieveLoggedUser();
    },[])

    useEffect(() => {
        if(!loggedUserLoading){
            handleGetSelectedDeviceByUserId();
        }
    }, [loggedUser, loggedUserLoading])
    
    // useEffect(() => {
    //     if(selectedDevice != {}){
    //         handleGetVolumeCalculationByUsersAndDevicesId();
    //     }
    // }, [selectedDevice])

    useEffect(() => {
        interval = setInterval(() => {
            console.log("Com internal")
            if(!selectedDeviceLoading){
                handleGetVolumeCalculationByUsersAndDevicesId();
            }
        }, MINUTE_MS*0.1);

        
      
        return () => { clearInterval(interval) }; // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
      }, [])


    
    useEffect(() => {
        console.log("Sem internal")

        if(!selectedDeviceLoading){
            handleGetVolumeCalculationByUsersAndDevicesId();
        }
       
    }, [selectedDevice, selectedDeviceLoading])



    // TODO ATUALIZAR A IMAGEM
    // if(selectedDevice && selectedDevice.usersAndDevicesId){

    useEffect(() => {
        if(!currentVolumeAndBatteryLevelLoading && currentVolumeAndBatteryLevel.volumeCalc.currentVolume){
            let currentVolume = currentVolumeAndBatteryLevel.volumeCalc.currentVolume*1000;
            let maxVolume = currentVolumeAndBatteryLevel.waterTank.theoVolume;
            let volumePercentage = currentVolume/maxVolume * 100
            let roundedNumber = Math.floor(volumePercentage/5)*5
            
            setLevelImage(images[roundedNumber])
        }
    },[currentVolumeAndBatteryLevel, selectedDevice, currentVolumeAndBatteryLevelLoading])



    const handleGetSelectedDeviceByUserId = async () => {
        
        setSelectedDeviceLoading(true);
        try {
        const [selectedDeviceResp] = await Promise.all([
            GetSelectedDeviceByUserId(loggedUser)
        ]);
        setSelectedDevice(selectedDeviceResp.data)
            
        }
        catch (err) {
        if(err.message === "Request failed with status code 404"){
            handleDeviceNotSelected();
        }else{
            Alert.alert("Error Message: ", err.message);
        }
        setSelectedDeviceError(err);
        }
        finally {
        setSelectedDeviceLoading(false);
        }
        
    };

    const handleGetVolumeCalculationByUsersAndDevicesId = async () => {
        setCurrentVolumeAndBatteryLevelLoading(true);

        if(!selectedDeviceLoading && selectedDevice.userDevice.usersAndDevicesId){
        // console.log("Ta chamando o handleGetVolumeCalculationByUsersAndDevicesId para selectedDevice.usersAndDevicesId: ", selectedDevice.usersAndDevicesId)
          try {
            const [calculationResp] = await Promise.all([
                GetVolumeCalculationByUsersAndDevicesId(selectedDevice.userDevice.usersAndDevicesId)
            ]);
            setCurrentVolumeAndBatteryLevel(calculationResp.data)
          }
          catch (err) {
            if(err.message === "Request failed with status code 404"){
                handleVolumeNotFound();
            }else{
              Alert.alert("Error Message: ", err.message);
            }
            setCurrentVolumeAndBatteryLevelError(err);
          }
          finally {
            setCurrentVolumeAndBatteryLevelLoading(false);
          }
        }
    };

    const handleVolumeNotFound = () => {
        Alert.alert("Error Message: ", "O dispositivo ainda nao realizou nenhuma leitura por favor aguarde (1h)");
    }
  
    const retrieveLoggedUser = async () => {
        setLoggedUserLoading(true)

        try {
          const valueString = await AsyncStorage.getItem('@loggedUserId');
          const value = JSON.parse(valueString);

          if(value !== null){
            setLoggedUser(value);
          }else{
            handleUserNotLogged();
          }          
        } catch (error) {
          console.log(error);
        }
        finally{
            setLoggedUserLoading(false)
        }
    };

    const handleUserNotLogged = () => {
        Alert.alert("Usuario nao registrado", `Por favor insira o usuário ID`);
        navigation.push('Login');
        // setTimeout(() => {navigation.navigate('SetNewDevice')}, 2000);      
    }

    const handleDeviceNotSelected = () => {
        Alert.alert("Nenhum dispositivo selecionado", `Por favor, selecione um dispositivo`);
        navigation.push('Devices');
        // setTimeout(() => {navigation.navigate('SetNewDevice')}, 2000);      
    }

    const formatDate = (dateString) => {
        let readDate = new Date(dateString)
        var month   = readDate.getUTCMonth() + 1; //months from 1-12
        var day     = readDate.getUTCDate();
        var year    = readDate.getUTCFullYear();
        
        var seconds = readDate.getSeconds();
        var minutes = readDate.getMinutes();
        var hour = readDate.getHours();

        return `${('0' + day).slice(-2)}/${('0' + month).slice(-2)}/${year} ${('0' + hour).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
    } 
        
    const [loaded] = useFonts({
        nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
        nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
    });

    if(!loaded){
    return null  
    }
    return(
        <Background>
            {/* {isLoading ? <Loading /> : } */}
            <TopBar>
              <AnaIcon>
                  <Image source={anaIcon}></Image>                                   
              </AnaIcon>
              <TopBarText>Meu nível</TopBarText>
              { !currentVolumeAndBatteryLevelLoading 
                ? (
                    <BatIcon 
                        style={{
                            transform: [
                                { scale: .8  }]
                        }}
                    >
                        <TouchableOpacity
                            onPress={ () => { navigation.push('HistoryLevelBatPage'); window.clearInterval(interval) }}
                        >
                        <Battery currentBatLevel={currentVolumeAndBatteryLevel.volumeCalc.currentBatteryLevel}></Battery>
                        </TouchableOpacity>
                    </BatIcon>
                )
                :(
                    <BatIconLoading>
                        <ActivityIndicatorDiv>
                            <ActivityIndicator size="large" color="#ffffff"></ActivityIndicator>
                        </ActivityIndicatorDiv>
                    </BatIconLoading>
                )
                }
            </TopBar>


            { !currentVolumeAndBatteryLevelLoading && currentVolumeAndBatteryLevel.volumeCalc.currentVolume 
                ?(
                    <LevelText>
                        {selectedDevice.userDevice.waterTankName}
                        {"\n"}
                        Leitura atual
                        {"\n"}
                        {(currentVolumeAndBatteryLevel.volumeCalc.currentVolume*1000).toFixed(2)} L
                        {"\n"}
                        {formatDate(currentVolumeAndBatteryLevel.eventsEndDevice.receivedAt)}
                    </LevelText>
                )
                :(
                    <ActivityIndicatorDiv>
                        <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
                    </ActivityIndicatorDiv>
                )
            }

            <WaterTank>
                {!currentVolumeAndBatteryLevelLoading && currentVolumeAndBatteryLevel.volumeCalc.currentVolume 
                    ?(
                        <Image source={levelImage}/>                    
                    )
                    :(
                        <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
                    )
                }
            </WaterTank>

            <Buttons>

                <TouchableOpacity
                    onPress={ () => { navigation.push('Devices'); window.clearInterval(interval) }}>

                    <Image 
                        style={{ margin: 20 }}
                        source={require('../assets/devices.png')}/>

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ () => { navigation.push('HistoryLevelPage'); window.clearInterval(interval) }}>
                    <Image source={require('../assets/historyButton.png')}/>
                </TouchableOpacity>


            </Buttons>
          <StatusBar style="auto" />

        </Background>
    )
}
