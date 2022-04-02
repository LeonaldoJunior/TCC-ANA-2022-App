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



export function MyLevelPage( {navigation} ){

    const [isLoading, setIsLoading] = useState(false);
    const [endDeviceDataResponse, setEndDeviceDataResponse] = useState(undefined);
    const [levelImage, setLevelImage] = useState(require("../assets/waterTank0.png"));
    const [endDeviceData, setEndDeviceData] = useState({});
    const [selectedDevice ,setSelectedDevice] = useState({});
    const [loggedUser ,setLoggedUser] = useState("");
    const [currentVolume ,setCurrentVolume] = useState(0);
    const [maxVolume ,setMaxVolume] = useState(0);



    

    
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
    {/* <Image source={require('../assets/waterTank100.png')}/> */}


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
        if(loggedUser.length > 5){
            retrieveDevicecSelected();
        }
    }, [loggedUser])
    

    useEffect(()=>{
        // const interval = setInterval(() => {
        //     const baseURL= "https://2833-2001-1284-f016-a1b0-2ca1-bbb7-1c46-9a84.ngrok.io/WebHook/GetByIdMax/eui-70b3d57ed0046195";
        //     console.log("call API")
        //     fetch(baseURL)
        //         .then(resp => resp.json())
        //         .then(json => {
        //             console.log("json")
        //             console.log(json)
        //             let x =
        //             {
        //                 "eventId": 32,
        //                 "endDeviceId": "eui-70b3d57ed0046195",
        //                 "applicationId": "leonaldo",
        //                 "devEui": "70B3D57ED0046195",
        //                 "devAddr": "260C04FD",
        //                        "gatewayId": "gw-cwb-uberaba-1",
        //                 "gatewayEui": "B827EBFFFF5C1DBF",
        //                 "receivedAt": "2021-11-18T00:47:45.124291898Z",
        //                 "fPort": 1,
        //                 "fCnt": 0,
        //                 "frmPayload": "AQIBjAICAys=",
        //                 "analogIn1": 3.96,
        //                 "analogIn2": 0.001
        //             }

        //             setEndDeviceData(x)
        //         })  
        // }, 10000);
        // return () => clearInterval(interval);
        

    },[])

    
  
  
    const retrieveDevicecSelected = async () => {
        try {
          const valueString = await AsyncStorage.getItem('@deviceSelected_API');
          const value = JSON.parse(valueString);

        //   console.log("value value value")
        //   console.log(value)

          if(value !== null){
            setSelectedDevice(value);      
          }else{
            handleDeviceNotSelected();
          }

          
        } catch (error) {
          console.log(error);
        }
    };

    const retrieveLoggedUser = async () => {
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

    const handleUserNotLogged = () => {
        Alert.alert("Usuario nao registrado", `Por favor insira o usuário ID`);
        navigation.navigate('Login');
        // setTimeout(() => {navigation.navigate('SetNewDevice')}, 2000);      
    }

    const handleDeviceNotSelected = () => {
        Alert.alert("Dispositivo não foi selecionado", `Por favor, selecione um dispositivo`);
        navigation.navigate('Devices');
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
              <AnaIcon          

              >

                  <Image source={anaIcon}></Image>                                   

              </AnaIcon>
              <TopBarText>Meu nível</TopBarText>
              

              <BatIcon 
                style={{
                    transform: [
                        { scale: .8  }]
                }}
              >
                <TouchableOpacity
                    onPress={ () => navigation.navigate('HistoryLevelBatPage')}
                >
                    <Battery currentBatLevel={4}></Battery>
                    {/* <Battery currentBatLevel={endDeviceData.analogIn1}></Battery> */}
                  {/* <Image source={Battery}></Image>                                    */}
                </TouchableOpacity>
              </BatIcon>
            </TopBar>


            {currentVolume > 0 
                ?(
                    <LevelText>
                        {selectedDevice.deviceName}
                        {"\n"}
                        Leitura atual
                        {"\n"}
                        {(currentVolume*1000).toFixed(2)} L
                        {"\n"}
                        {formatDate(endDeviceData.receivedAt)}
                    </LevelText>
                )
                :(
                    <ActivityIndicatorDiv>
                        <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
                    </ActivityIndicatorDiv>
                )
            }

            <WaterTank>
                {currentVolume > 0 
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
                    onPress={ () => navigation.navigate('Devices')}>
                    <Image 
                        style={{ margin: 20 }}
                        source={require('../assets/devices.png')}/>

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ () => navigation.navigate('HistoryLevelPage')}>
                    <Image source={require('../assets/historyButton.png')}/>
                </TouchableOpacity>


            </Buttons>
          <StatusBar style="auto" />

        </Background>
    )
}
