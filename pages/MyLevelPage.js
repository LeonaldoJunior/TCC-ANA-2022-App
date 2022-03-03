import { StatusBar } from 'expo-status-bar';
import React, { Children, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
import backArrow from '../assets/backArrow.png'
import Battery from '../assets/battery80.png'
import anaIcon from '../assets/anaIcon.png'
import GetCaixasDagua from '../services/GetCaixasDaguaApi'
import { useFonts } from 'expo-font'
import AsyncStorage  from '@react-native-async-storage/async-storage';

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
    margin-top: 20px

`;

// Talvez abaixar mais a caixa dagua verificar depois
const WaterTank = styled.View`
    justify-content: center;
    align-items: center; 
    margin-top: 30px

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
    const [currentVolume ,setCurrentVolume] = useState(0);
    const [maxVolume ,setMaxVolume] = useState(0);



    

    
    const images = [
        require("../assets/waterTank100.png"),
        require("../assets/waterTank95.png"),
        require("../assets/waterTank90.png"),
        require("../assets/waterTank85.png"),
        require("../assets/waterTank80.png"),
        require("../assets/waterTank75.png"),
        require("../assets/waterTank70.png"),
        require("../assets/waterTank65.png"),
        require("../assets/waterTank60.png"),
        require("../assets/waterTank55.png"),
        require("../assets/waterTank50.png"),
        require("../assets/waterTank45.png"),
        require("../assets/waterTank40.png"),
        require("../assets/waterTank35.png"),
        require("../assets/waterTank30.png"),
        require("../assets/waterTank25.png"),
        require("../assets/waterTank20.png"),
        require("../assets/waterTank15.png"),
        require("../assets/waterTank10.png"),
        require("../assets/waterTank5.png"),
        require("../assets/waterTank0.png"),
         {/* <Image source={require('../assets/waterTank100.png')}/> */}
    ]

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            retrieveDevicecSelected();
        });
        return unsubscribe;
      }, [navigation]);

    useEffect(() => {
        // fluidRadiusCalculation();
        retrieveDevicecSelected();
    },[])

    useEffect(() => {
        setCurrentVolume(volumeCalculation());
        setMaxVolume(maxVolumeCalculation());        
    },[endDeviceData])


    useEffect(() => {
        console.log("currentVolume");
        console.log(currentVolume);
    },[currentVolume])

    useEffect(() => {
        console.log("maxVolume");
        console.log(maxVolume);
    },[maxVolume])

    
    // useEffect(() => {
    //     console.log("endDeviceData");
    //     console.log(endDeviceData);
    // },[endDeviceData])

    

    useEffect(()=>{
        const interval = setInterval(() => {
            const baseURL= "https://f115-138-204-26-247.ngrok.io/CaixaAgua/GetByIdMax/eui-70b3d57ed0046195";
            console.log("baseURL")
            console.log(baseURL)
            fetch(baseURL)
                .then(resp => resp.json())
                .then(json => {
                    // console.log("json")
                    // console.log(json)
                    let x =
                    {
                        "eventId": 32,
                        "endDeviceId": "eui-70b3d57ed0046195",
                        "applicationId": "leonaldo",
                        "devEui": "70B3D57ED0046195",
                        "devAddr": "260C04FD",
                        "gatewayId": "gw-cwb-uberaba-1",
                        "gatewayEui": "B827EBFFFF5C1DBF",
                        "receivedAt": "2021-11-18T00:47:45.124291898Z",
                        "fPort": 1,
                        "fCnt": 0,
                        "frmPayload": "AQIBjAICAys=",
                        "analogIn1": 3.96,
                        "analogIn2": 0.24
                    }

                    setEndDeviceData(x)
                })  
        }, 10000);
        
        
        
        // let x =
        // {
        //     "eventId": 32,
        //     "endDeviceId": "eui-70b3d57ed0046195",
        //     "applicationId": "leonaldo",
        //     "devEui": "70B3D57ED0046195",
        //     "devAddr": "260C04FD",
        //     "gatewayId": "gw-cwb-uberaba-1",
        //     "gatewayEui": "B827EBFFFF5C1DBF",
        //     "receivedAt": "2021-11-18T00:47:45.124291898Z",
        //     "fPort": 1,
        //     "fCnt": 0,
        //     "frmPayload": "AQIBjAICAys=",
        //     "analogIn1": 3.96,
        //     "analogIn2": 0.05
        // }

        // setEndDeviceData(x)

        return () => clearInterval(interval);
        

    },[])

  
    //     const interval = setInterval(() => {

    //         // const baseURL= 'https://e9ab-191-5-234-123.ngrok.io/webhook/GetByIdMax/eui-70b3d57ed0046195';
    //         const baseURL= "https://0b7e-191-5-234-123.ngrok.io/webhook/GetByIdMax/eui-70b3d57ed0046195";
    //         console.log("baseURL")
    //         console.log(baseURL)
    //         fetch(baseURL)
    //             .then(resp => resp.json())
    //             .then(json => {
    //                 console.log("json");
    //                 console.log(json);
    //                 console.log("json.analogIn2");
    //                 console.log(json.analogIn2*100);
    //                 setEndDeviceDataResponse(json);
    //                 if (json.analogIn2*100 < 28) { 
    //                     console.log("NAO ENTROU NO MENOR 28")
                        
    //                     setLevelImage(images[1])} else
    //                 if (json.analogIn2*100 < 37.55 && json.analogIn2*100 > 28) {                 
    //                     setLevelImage(images[2]);
                        
    //                     console.log("levelImage")
    //                     console.log(levelImage)
    //                 } else
    //                 if (json.analogIn2*100 < 46.1 && json.analogIn2*100 > 37.55) { setLevelImage(images[3]) } else
    //                 if (json.analogIn2*100 < 54.65 && json.analogIn2*100 > 46.1) { setLevelImage(images[4]) } else
    //                 if (json.analogIn2*100 < 63.2 && json.analogIn2*100 > 54.65) { setLevelImage(images[5]) } else
    //                 if (json.analogIn2*100 < 71.75 && json.analogIn2*100 > 63.2) { setLevelImage(images[6]) } else
    //                 if (json.analogIn2*100 < 80.3 && json.analogIn2*100 > 71.75) { setLevelImage(images[7]) } else
    //                 if (json.analogIn2*100 < 88.85 && json.analogIn2*100 > 80.3) { setLevelImage(images[8]) } else
    //                 if (json.analogIn2*100 < 97.4 && json.analogIn2*100 > 88.85) { setLevelImage(images[9]) } else
    //                 if (json.analogIn2*100 < 105.95 && json.analogIn2*100 > 97.4) { setLevelImage(images[10]) } else
    //                 if (json.analogIn2*100 < 114.5 && json.analogIn2*100 > 105.95) { setLevelImage(images[11]) } else
    //                 if (json.analogIn2*100 < 123.05 && json.analogIn2*100 > 114.5) { setLevelImage(images[12]) } else
    //                 if (json.analogIn2*100 < 131.6 && json.analogIn2*100 > 123.05) { setLevelImage(images[13]) } else
    //                 if (json.analogIn2*100 < 140.15 && json.analogIn2*100 > 131.6) { setLevelImage(images[14]) } else
    //                 if (json.analogIn2*100 < 148.7 && json.analogIn2*100 > 140.15) { setLevelImage(images[15]) } else
    //                 if (json.analogIn2*100 < 157.25 && json.analogIn2*100 > 148.7) { setLevelImage(images[16]) } else
    //                 if (json.analogIn2*100 < 165.8 && json.analogIn2*100 > 157.25) { setLevelImage(images[17]) } else
    //                 if (json.analogIn2*100 < 174.35 && json.analogIn2*100 > 165.8) { setLevelImage(images[18]) } else
    //                 if (json.analogIn2*100 < 182.9 && json.analogIn2*100 > 174.35) { setLevelImage(images[19]) } else
    //                 if (json.analogIn2*100 > 191.45) { setLevelImage(images[20]) }

    //                 console.log("levelImage")
    //                 console.log(levelImage)
    //             })
    //             .catch((error) => alert(error))
     


    //     }, 10000);
    //       return () => clearInterval(interval);

        
       
    // }, [])

    // Calculo Do Volume
    // fluidHeight = alturaCaixa - medicaoSensor
    // [fórmula] alturaCaixa = endDeviceData.analogIn2
    // [??] Discutir com a Fran o valor do analogIn2
    // Tronco de cone:
    // [fórmula] volume = (pi * fluidHeight)(baseRadius^2 + (baseRadius*fluidRadius) + fluidRadius^2)/3

    // | fluidHeight        fluidRadius     1 |
    // | 0                  baseRadius      1 |
    // | waterTankHeight    topRadius       1 |

    // DETERMINANTE
    // | fluidHeight        fluidRadius     1 | fluidHeight         fluidRadius
    // | 0                  baseRadius      1 | 0                   baseRadius
    // | waterTankHeight    topRadius       1 | waterTankHeight     topRadius

    // FÓRMULA (Equação da reta)
    // [fórmula] fluidRadius = baseRadius - fluidHeight*(baseRadius - topRadius)/ waterTankHeight


    const retrieveDevicecSelected = async () => {
        try {
          const valueString = await AsyncStorage.getItem('@deviceSelected_API');
          const value = JSON.parse(valueString);

          if(value.deviceId > 0){
              console.log(value)
            setSelectedDevice(value);      
          }else{
            handleDeviceNotSelected();
          }

          
        } catch (error) {
          console.log(error);
        }
    };

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
    
    const fluidRadiusCalculation = () => {
        // console.log("selectedDevice")
        // console.log(selectedDevice)
        
        if(selectedDevice.deviceId){

            let baseRadius          = selectedDevice.selectedWaterTank.raioBase;
            let fluidHeight         = fluidHeightCalculation();
            let topRadius           = selectedDevice.selectedWaterTank.raioTopo;
            let waterTankHeight     = selectedDevice.selectedWaterTank.altura;
                            
            return (baseRadius - ((fluidHeight*(baseRadius - topRadius)))/(waterTankHeight))
            // let baseRadius      = 0.0540
            // let fluidHeight     = 0.0525;
            // let topRadius       = 0.0685;
            // let waterTankHeight = 0.1050;

            // let teste = baseRadius - ((fluidHeight*(baseRadius - topRadius)))/waterTankHeight
    
            // [fórmula] fluidRadius = baseRadius - fluidHeight*(baseRadius - topRadius)/ waterTankHeight
            // return baseRadius - ((fluidHeight*(baseRadius - topRadius)))/waterTankHeight
            // volumeCalculation();
        }
        return 0;
    }

    const fluidHeightCalculation = () => {
        if(selectedDevice.deviceId){
            if(endDeviceData.analogIn2){
                return (selectedDevice.selectedWaterTank.altura - endDeviceData.analogIn2);      
            }
        }
        return 0;
    }

    const maxVolumeCalculation = () =>{
        if(selectedDevice.deviceId){
            let baseRadius = selectedDevice.selectedWaterTank.raioBase;
            let height = selectedDevice.selectedWaterTank.altura;
            let topRadius = selectedDevice.selectedWaterTank.raioTopo;
            
            return (Math.PI * height)*(Math.pow(baseRadius,2) + (baseRadius*topRadius) + Math.pow(topRadius,2))/3
        }

        return 0;

    }
    const volumeCalculation = () => {
          
        let fluidHeight     = fluidHeightCalculation();
        let fluidRadius     = fluidRadiusCalculation();
                
        if(fluidHeight !== 0 && fluidRadius !== 0 && selectedDevice.deviceId){
            let baseRadius = selectedDevice.selectedWaterTank.raioBase;


            return (Math.PI * fluidHeight)*(Math.pow(baseRadius,2) + (baseRadius*fluidRadius) + Math.pow(fluidRadius,2))/3
        }
        
        return 0;
        
        
        // [fórmula] volume = (pi * fluidHeight)(baseRadius^2 + (baseRadius*fluidRadius) + fluidRadius^2)/3
        // let baseRadius      = 0.0540
        // let fluidHeight     = 0.0525;
        // let fluidRadius     = 0.06125;

        // let volume = (Math.PI * fluidHeight)*(Math.pow(baseRadius,2) + (baseRadius*fluidRadius) + Math.pow(fluidRadius,2))/3        
    }

    //     Object {
    //   "deviceId": "3333",
    //   "deviceName": "3333",
    //   "selectedWaterTank": Object {
    //     "altura": 0.58,
    //     "caixaId": 5,
    //     "capacidade": 500,
    //     "marca": "FORTLEV",
    //     "baseRadius": 0.95,
    //     "topRadius": 1.22,
    //   },

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
                  <Image source={Battery}></Image>                                   
                </TouchableOpacity>
              </BatIcon>
            </TopBar>

                <LevelText>
                    {selectedDevice.deviceName}
                    {"\n"}
                    Leitura atual
                    {"\n"}
                    {endDeviceData.analogIn2}%
                    {"\n"}
                    {formatDate(endDeviceData.receivedAt)}
                </LevelText>
            <WaterTank>
                {/* jeito certo de carregar imagem */}
                {/* <Image source={images[1]}/> */}
                <Image source={levelImage}/>
                


                {/* src={require(`${this.state.img_path}`)} */}

                
                {/* <Image source={require('../assets/waterTank95.png')}/> */}
                {/* <Image source={require('../assets/waterTank90.png')}/> */}
                {/* <Image source={require('../assets/waterTank85.png')}/> */}
                
            </WaterTank>

            <Buttons>

                <TouchableOpacity
                    onPress={ () => navigation.navigate('Devices')}>
                    <Image 
                        style={{ margin: 20 }}
                        source={require('../assets/devices.png')}/>

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ () => navigation.navigate('HistoryLevelP  age')}>
                    <Image source={require('../assets/historyButton.png')}/>
                </TouchableOpacity>


            </Buttons>
          <StatusBar style="auto" />

        </Background>
    )
}
