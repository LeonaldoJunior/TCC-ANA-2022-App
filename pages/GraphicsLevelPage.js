import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator, Picker, Button, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import _ from "lodash"
import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import { useFonts } from 'expo-font'
import AsyncStorage  from '@react-native-async-storage/async-storage';

import DateTimePicker from '@react-native-community/datetimepicker';

import { Dimensions } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";




import * as shape from 'd3-shape'
import { compareAsc, format } from 'date-fns'

import GetVolumeCalculationByUsersAndDevicesIdAndDate from '../services/GetVolumeCalculationByUsersAndDevicesIdAndDate'
import GetSelectedDeviceByUserId from '../services/GetSelectedDeviceByUserId'

import DatePickerIcon from '../assets/datePicker.png'



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
const GraphView = styled.View`
`;

const LabelText = styled.Text`
  font-style: normal;
  font-size: 18px;
  line-height: 22px;
  margin :20px;
`;

const DatePickerButton = styled.View`
  margin: 10px;
  align-items: center;
`;


let interval;


export function GraphicsLevelPage( {navigation} ) {
  const [loggedUser ,setLoggedUser] = useState("");
  const [loggedUserLoading ,setLoggedUserLoading] = useState(true);
  
  const [showLast, setShowLast] = useState(1);


  const [selectedDevice ,setSelectedDevice] = useState({});
  const [selectedDeviceLoading, setSelectedDeviceLoading] = useState(true);
  const [selectedDeviceError, setSelectedDeviceError] = useState({});

  const [listVolumeAndBatteryLevel ,setListVolumeAndBatteryLevel] = useState([]);
  const [listVolumeAndBatteryLevelLoading, setListVolumeAndBatteryLevelLoading] = useState(true);
  const [listVolumeAndBatteryLevelError, setListVolumeAndBatteryLevelError] = useState({});

  const [dataLabels ,setDataLabels] = useState([]);

  const [logs, setLogs] = useState([]);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  

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


  useEffect(()=>{
    handleGetVolumeCalculationByUsersAndDevicesIdAndDate()
  },[selectedDevice,selectedDeviceLoading, date])
 
  useEffect(()=>{
    if(!listVolumeAndBatteryLevelLoading && listVolumeAndBatteryLevel && listVolumeAndBatteryLevel.length > 0){
      setLogs(
        listVolumeAndBatteryLevel.map((elm)=>{
          return {
          "VolumePercentage" : calcVolumePercentage(elm),
          "VolumeLiters": elm.volumeCalc.currentVolume*1000,
          "Date": formatDate(elm.eventsEndDevice.receivedAt),
          "Hour": formatHour(elm.eventsEndDevice.receivedAt)
          }
        })
      )
    }

  },[listVolumeAndBatteryLevel, listVolumeAndBatteryLevelLoading])

  
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

const handleGetVolumeCalculationByUsersAndDevicesIdAndDate = async () => {
    console.log(date)
    setListVolumeAndBatteryLevelLoading(true);

    if(!selectedDeviceLoading && selectedDevice.userDevice.usersAndDevicesId){
    try {
        const [calculationResp] = await Promise.all([
          GetVolumeCalculationByUsersAndDevicesIdAndDate(selectedDevice.userDevice.usersAndDevicesId, formatDatePicker(date))
        ]);
        setListVolumeAndBatteryLevel(calculationResp.data)


      }
      catch (err) {
        if(err.message === "Request failed with status code 404"){
            handleVolumeNotFound();
        }else{
          Alert.alert("Error Message: ", err.message);
        }
        setListVolumeAndBatteryLevelError(err);
      }
      finally {
        setListVolumeAndBatteryLevelLoading(false);
      }
    }
};


const handleVolumeNotFound = () => {
    Alert.alert("Error Message: ", "Não foram encontrados registros para essa data");
}


const handleUserNotLogged = () => {
  Alert.alert("Usuario não registrado", `Por favor insira o usuário ID`);
  window.clearInterval(interval)
  navigation.push('Login');

  // setTimeout(() => {navigation.push('SetNewDevice')}, 2000);      
}

const onChange = (event, selectedDate) => {
  let currentDate = selectedDate;
  if(!selectedDate){
    currentDate = date
  }
  
  setShow(false);
  setDate(currentDate);
  
};

const showMode = (currentMode) => {
  setShow(true);
  setMode(currentMode);
};

const showDatepicker = () => {
  showMode('date');
};

    const [ columns, setColumns ] = useState([
        "Volume(%)",
        "Volume(L)",
        "Data",
        "Hora", 
      ])
      const [ direction, setDirection ] = useState(null)
      const [ selectedColumn, setSelectedColumn ] = useState(null)

      // full date
      // const formatDate = (date) =>{
      //   let yyyy = date.substring(0,4);
      //   let mm    = date.substring(5,7);
      //   let dd    = date.substring(8,10);
      //   return `${dd}/${mm}/${yyyy}`;
      // }

      const formatDate = (date) =>{
        let mm    = date.substring(5,7);
        let dd    = date.substring(8,10);
        return `${dd}/${mm} `;
      }

      const formatDatePicker = (date) => {
        let dateFormatted = ((date.getDate() )) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear(); 
        return dateFormatted
      }





      const formatHour = (date) =>{
        return date.substring(11,16);
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
          {/* {true 
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
          } */}

          <DatePickerButton>
            <TouchableOpacity onPress={showDatepicker}>
              <Image source={DatePickerIcon}></Image>
            </TouchableOpacity>
          </DatePickerButton>


            
          <LabelText>Data Selecionada: {formatDatePicker(date)}</LabelText>
            {show && (
              <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
              />
            )}


          { !listVolumeAndBatteryLevelLoading ?  (
            <GraphView>
              {logs.length > 0 && (
                <LineChart
                  bezier
                  data={{
                    labels: logs.map((item)=>item.Hour),
                    datasets: [
                      {
                        data: logs.map((item)=>item.VolumeLiters)
                      }
                      
                    ],
                    legend: ["Nível"] // optional
  
                  }}
                  width={Dimensions.get("window").width*0.97}
                  height={350}
                  yAxisLabel=""
                  yAxisSuffix="L"
                  segments={10}
                  fromZero
                  yAxisInterval={1} // optional, defaults to 1
                  verticalLabelRotation={80}
                  chartConfig={{
                    backgroundColor: "#0079e2",
                    backgroundGradientFrom: "#0079e2",
                    backgroundGradientTo: "#0079e2",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "2",
                      strokeWidth: "1",
                      stroke: "#fff"
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: "1" // solid background lines with no dashes
                    },
                    propsForLabels:{
                      color:'#000',
                      fontSize: 11,
  
                    },
                    
                  }}
  
                  style={{
                    borderRadius: 10,
                    paddingTop: 5,
                    paddingLeft: 5,
                    paddingRight: 40,
                  }}
                />
              )}
            </GraphView>
          )
          :(
            <ActivityIndicatorDiv>
                <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
            </ActivityIndicatorDiv>
          )

          }





      </Background>
  );
}

