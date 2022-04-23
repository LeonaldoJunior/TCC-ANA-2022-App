import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, Picker } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import _ from "lodash"
import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import { useFonts } from 'expo-font'
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { LineChart,AreaChart, YAxis,XAxis, Grid, Decorator } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import GetVolumeCalculationByUsersAndDevicesIdListFilterDay from '../services/GetVolumeCalculationByUsersAndDevicesIdListFilterDay'
import GetSelectedDeviceByUserId from '../services/GetSelectedDeviceByUserId'



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

const ActivityIndicatorDiv = styled.View`
    height: 150px;
    margin-top: 30px;
`;

const Buttons = styled.View`    
    justify-content: center;
    align-items: center; 
    margin-top: 30px;
`;

const InputView = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 98px;
  align-items: center;
`;

const LabelText = styled.Text`
  font-style: normal;
  font-size: 18px;
  line-height: 22px;
  margin :20px;
`;


let interval;


export function GraphicsLevelPage( {navigation} ) {
  const [loggedUser ,setLoggedUser] = useState("");
  const [loggedUserLoading ,setLoggedUserLoading] = useState(true);
  
  const [showLast, setShowLast] = useState(1);


  const [selectedDevice ,setSelectedDevice] = useState({});
  const [selectedDeviceLoading, setSelectedDeviceLoading] = useState(true);
  const [selectedDeviceError, setSelectedDeviceError] = useState({});

  const [currentVolumeAndBatteryLevel ,setCurrentVolumeAndBatteryLevel] = useState({});
  const [currentVolumeAndBatteryLevelLoading, setCurrentVolumeAndBatteryLevelLoading] = useState(true);
  const [currentVolumeAndBatteryLevelError, setCurrentVolumeAndBatteryLevelError] = useState({});

  const [logs, setLogs] = useState({});
  

  const MINUTE_MS = 60000;

  const options = [
    { value: '1', label: '1 dia' },
    { value: '7', label: '7 dias' },
    { value: '15', label: '15 dias' },
    { value: '30', label: '30 dias' },
    { value: '60', label: '60 dias' },
    { value: '180', label: '180 dias' },
    { value: '360', label: '360 dias' }
  ]

  // const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 23 ]
  const xAxesSvg = {
    fontSize: 10,
    fill: "black",
    rotation: 70,
    originY: 15,
    y: 10,
  };
  const yAxesSvg = { fontSize: 12, fill: "black", marginLeft: 20 };
  const gridSvg = { left: 10,  fill: "black" };

  const verticalContentInset = { left: 0, right: 10, top: 10, bottom: 1 };
  const xAxisHeight = 50;

  const data=[ 
    { xValue: 0, yValue: 0},
    { xValue: 1, yValue: 1},
    { xValue: 2, yValue: 2},
    { xValue: 3, yValue: 3},
    { xValue: 4, yValue: 4},
    { xValue: 5, yValue: 5},
    { xValue: 6, yValue: 6},
    { xValue: 7, yValue: 7},
    { xValue: 8, yValue: 8},
    { xValue: 9, yValue: 9},
    { xValue: 10, yValue: 10},
    { xValue: 11, yValue: 11},
    { xValue: 12, yValue: 12},
    { xValue: 13, yValue: 13},
    { xValue: 14, yValue: 14},
    { xValue: 15, yValue: 15},
    { xValue: 16, yValue: 16},
    { xValue: 17, yValue: 17},
    { xValue: 18, yValue: 18},
    { xValue: 19, yValue: 19},
    { xValue: 20, yValue: 20},
    { xValue: 21, yValue: 21},
    { xValue: 22, yValue: 22},
    { xValue: 23, yValue: 23},
    { xValue: 24, yValue: 24},
  ]
  var xAxisData = [ 
    { xValue: 1},
    { xValue: 2},
    { xValue: 3},
    { xValue: 4},
    { xValue: 5},
    { xValue: 6},
    { xValue: 7},
    { xValue: 8},
    { xValue: 9},
    { xValue: 10},
    { xValue: 11},
    { xValue: 12},
    { xValue: 13},
    { xValue: 14},
    { xValue: 15},
    { xValue: 16},
    { xValue: 17},
    { xValue: 18},
    { xValue: 19},
    { xValue: 20},
    { xValue: 21},
    { xValue: 22},
    { xValue: 23},
    { xValue: 24},
  ]

  var yAxisData = [ 
    { yValue: 0},
    { yValue: 1},
    { yValue: 2},
    { yValue: 3},
    { yalue: 4},
    { yValue: 5},
    { yValue: 6},
    { yalue: 7},
    { yalue: 8},
    { yValue: 9},
    { yValue: 10},
    { yValue: 11},
    { yValue: 12},
    { yValue: 13},
    { yValue: 14},
    { yValue: 15},
    { yValue: 16},
    { yValue: 17},
    { yValue: 18},
    { yValue: 19},
    { yValue: 20},
    { yValue: 21},
    { yValue: 22},
    { yValue: 23},
    { yValue: 24}
  ]
    
  const optionsList = (
    // devicesList.map((s, i) => { return <Picker.Item key={i} value={s} label={s.userDevice.waterTankName} /> })
    options.map((s, i) => { return <Picker.Item key={i} value={s.value} label={s.label} /> })
  )

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
  //   const interval = setInterval(() => {
  //     console.log("Com internal GraphicsLevelPage")

  //     if(!selectedDeviceLoading){
  //       handleGetVolumeCalculationByUsersAndDevicesIdByDay();
  //     }
  //     else
  //     { 
  //         console.log ("selectedDevice != {},    device not selected")
  //     }
  //   }, MINUTE_MS);
  
  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, [])

  // useEffect(() => {
  //   console.log("Sem internal")
  //   if(!selectedDeviceLoading){
  //     handleGetVolumeCalculationByUsersAndDevicesIdByDay();
  //   } 
  // }, [selectedDevice, selectedDeviceLoading])

  // useEffect(()=>{
  //   console.log("currentVolumeAndBatteryLevel")
  //   console.log(currentVolumeAndBatteryLevel)
  // },[currentVolumeAndBatteryLevel])

  // useEffect(()=>{
  //   console.log("logs")
  //   console.log(logs)
  // },[logs])


  useEffect(()=>{
    // const [logs, setLogs] = useState({});
    if(!currentVolumeAndBatteryLevelLoading){
      setLogs(
        currentVolumeAndBatteryLevel.map((elm)=>{
          return {
          "VolumePercentage" : calcVolumePercentage(elm),
          "VolumeLiters": elm.volumeCalc.currentVolume*1000,
          "Date": formatDate(elm.eventsEndDevice.receivedAt),
          "Hour": formatHour(elm.eventsEndDevice.receivedAt)
          }
        })
      )
    }

  },[currentVolumeAndBatteryLevel, currentVolumeAndBatteryLevelLoading])
  
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

const handleGetVolumeCalculationByUsersAndDevicesIdByDay = async (lastDays) => {

    setCurrentVolumeAndBatteryLevelLoading(true);

    if(!selectedDeviceLoading && selectedDevice.userDevice.usersAndDevicesId){
    // console.log("Ta chamando o handleGetVolumeCalculationByUsersAndDevicesId para selectedDevice.usersAndDevicesId: ", selectedDevice.usersAndDevicesId)

    try {
        const [calculationResp] = await Promise.all([
          GetVolumeCalculationByUsersAndDevicesIdListFilterDay(selectedDevice.userDevice.usersAndDevicesId, lastDays)
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


const handleUserNotLogged = () => {
  Alert.alert("Usuario nao registrado", `Por favor insira o usuário ID`);
  window.clearInterval(interval)
  navigation.push('Login');

  // setTimeout(() => {navigation.push('SetNewDevice')}, 2000);      
}


    const [ columns, setColumns ] = useState([
        "Volume(%)",
        "Volume(L)",
        "Data",
        "Hora", 
      ])
      const [ direction, setDirection ] = useState(null)
      const [ selectedColumn, setSelectedColumn ] = useState(null)

      const formatDate = (date) =>{
        let yyyy = date.substring(0,4);
        let mm    = date.substring(5,7);
        let dd    = date.substring(8,10);
        return `${dd}/${mm}/${yyyy}`;
      }

      const formatHour = (date) =>{
        return date.substring(11,19);
      }

      const calcVolumePercentage = (data) =>{
        let currentVolume = data.volumeCalc.currentVolume*1000;
        let maxVolume = data.waterTank.theoVolume;
        return currentVolume/maxVolume * 100
      }
      
  const [loaded] = useFonts({
    nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
    nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
  });
  if(!loaded){
    return null  
  }

  return (
      <Background>
        <View>
          <TopBar>
            <ArrowIcon>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                <Image source={backArrow}></Image>                                   
                </TouchableOpacity>
            </ArrowIcon>
            <TopBarText>Gráfico do nível </TopBarText>
              
            <BatIcon 
              style={{
                transform: [
                  { scale: .8  }
                ]
              }}
            >
              <TouchableOpacity
                onPress={ () => { navigation.push('HistoryLevelBatPage'); window.clearInterval(interval) }}
              >
                <Image source={Battery}></Image>                                   
              </TouchableOpacity>
            </BatIcon>
          </TopBar>            
          {true 
            ? (
            
              <InputView>
              <LabelText>Carregar os dados dos ultimos: </LabelText>
              <Picker
                selectedValue={showLast}
                style={{ height: 50, width: 150, border: 10 }}
                onValueChange={handleGetVolumeCalculationByUsersAndDevicesIdByDay}
                mode={"dropdown"}
              >
                <Picker.Item label="" value="" />
                {optionsList}
              </Picker>
              
              </InputView>
            )
            :(
              <ActivityIndicatorDiv>
                  <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
              </ActivityIndicatorDiv>
            )
          }

          <View
            style={{
              paddingRight: 10,
              height: 400,
              padding: 0,
              flexDirection: "row"
            }}
          >
            <YAxis
              data={yAxisData}
              yAccessor={({ item }) => item.yValue}
              style={{ marginBottom: xAxisHeight }}
              contentInset={verticalContentInset}
              svg={yAxesSvg}
              formatLabel={value => value + " "}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <LineChart
                  style={{ flex: 1, marginLeft: 16 }}

                  data={data}
                  yAccessor={({ item }) => item.yValue}
                  xAccessor={({ item }) => item.xValue}
                  svg={{ stroke: 'rgb(134, 65, 244)' }}
                  numberOfTicks={24}
                  contentInset={verticalContentInset}


                  // xScale={scale.scaleTime}
                  // svg={{ stroke: "rgb(134, 65, 244)" }}

                  spacing={0.2}
                  gridMin={0}

              >
                <Grid />
                <Grid 
                  direction={Grid.Direction.VERTICAL}
                  />
              </LineChart>
              <XAxis
                style={{ marginHorizontal: -10, height: xAxisHeight }}
                data={xAxisData}
                xAccessor={({ item }) => item.xValue}
                contentInset={{ left: 30, right: 10, top: -100, bottom: -100}}
                formatLabel={value => value + "11:00"}

                svg={xAxesSvg}
              />
            </View>
          </View>






        </View>
      </Background>
  );
}

