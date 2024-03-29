import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import _ from "lodash"
import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import { useFonts } from 'expo-font'
import AsyncStorage  from '@react-native-async-storage/async-storage';

import GetVolumeCalculationByUsersAndDevicesIdList from '../services/GetVolumeCalculationByUsersAndDevicesIdList'
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


let interval;


export function HistoryLevelBatPage( {navigation} ) {
  const [loggedUser ,setLoggedUser] = useState("");
  const [loggedUserLoading ,setLoggedUserLoading] = useState(true);
  
  const [selectedDevice ,setSelectedDevice] = useState(null);
  const [selectedDeviceLoading, setSelectedDeviceLoading] = useState(true);
  const [selectedDeviceError, setSelectedDeviceError] = useState({});

  const [currentVolumeAndBatteryLevel ,setCurrentVolumeAndBatteryLevel] = useState(null);
  const [currentVolumeAndBatteryLevelLoading, setCurrentVolumeAndBatteryLevelLoading] = useState(true);
  const [currentVolumeAndBatteryLevelError, setCurrentVolumeAndBatteryLevelError] = useState({});

  const [logs, setLogs] = useState([]);

  const maxBatLevel = 3;
  

  const MINUTE_MS = 60000;


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


  useEffect(() => {
    const interval = setInterval(() => {
      if(selectedDevice){
        handleGetVolumeCalculationByUsersAndDevicesIdList();
      }
    }, MINUTE_MS*1);
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  useEffect(() => {
    if(!selectedDeviceLoading){
      handleGetVolumeCalculationByUsersAndDevicesIdList();
    } 
  }, [selectedDevice, selectedDeviceLoading])

  useEffect(()=>{
    if(!currentVolumeAndBatteryLevelLoading && currentVolumeAndBatteryLevel){
      setLogs(
        currentVolumeAndBatteryLevel.map((elm)=>{
          return {
          "BatPercentage" : calcBatLevelPercentage(elm),
          "BatVolts": elm.volumeCalc.currentBatteryLevel,
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
        Alert.alert("Mensagem de Erro: ", err.message);
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

const handleGetVolumeCalculationByUsersAndDevicesIdList = async () => {
    setCurrentVolumeAndBatteryLevelLoading(true);

    if(!selectedDeviceLoading && selectedDevice.userDevice.usersAndDevicesId){
      try {
        const [calculationResp] = await Promise.all([
            GetVolumeCalculationByUsersAndDevicesIdList(selectedDevice.userDevice.usersAndDevicesId)
        ]);
        setCurrentVolumeAndBatteryLevel(calculationResp.data)
      }
      catch (err) {
        if(err.message === "Request failed with status code 404"){
            handleVolumeNotFound();
        }else{
          Alert.alert("Mensagem de Erro: ", err.message);
        }
        setCurrentVolumeAndBatteryLevelError(err);
      }
      finally {
        setCurrentVolumeAndBatteryLevelLoading(false);
      }
    }
};


const handleVolumeNotFound = () => {
    Alert.alert("Mensagem de Erro: ", "O dispositivo ainda não realizou nenhuma leitura por favor aguarde (1h)");
}


const handleUserNotLogged = () => {
  Alert.alert("Usuário não registrado.", `Por favor insira o usuário ID.`);
  navigation.push('Login');
  // setTimeout(() => {navigation.push('SetNewDevice')}, 2000);      
}


    const [ columns, setColumns ] = useState([
        "Bateria(%)",
        "Bateria(V)",
        "Data",
        "Hora", 
      ])
      const [ direction, setDirection ] = useState(null)
      const [ selectedColumn, setSelectedColumn ] = useState(null)

      const formatDate = (dateString) => {
        let readDate = new Date(dateString)
        readDate.setHours(readDate.getHours());

        var month   = readDate.getMonth() + 1; //months from 1-12
        var day     = readDate.getDate();
        var year    = readDate.getFullYear();

        return `${('0' + day).slice(-2)}/${('0' + month).slice(-2)}/${year}`;
      } 

      const formatHour = (dateString) => {
        let readDate = new Date(dateString)
        readDate.setHours(readDate.getHours());

        var seconds = readDate.getSeconds();
        var minutes = readDate.getMinutes();
        var hour = readDate.getHours();

        return `${('0' + hour).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
      } 

      const calcBatLevelPercentage = (data) => {
        let currentBatLevel = data.volumeCalc.currentBatteryLevel;
        let batPercen = currentBatLevel/maxBatLevel * 100
        if(batPercen > 100){
          return 100;
        }
        else{
          return batPercen;
        }
      }
      
      const sortTable = (column) => {
        const newDirection = direction === "desc" ? "asc" : "desc" 
        const sortedData = _.orderBy(logs, [column],[newDirection])
        setSelectedColumn(column)
        setDirection(newDirection)
        setLogs(sortedData)
      }
      const tableHeader = () => (
        <View style={styles.tableHeader}>
          {
            columns.map((column, index) => {
              {
                return (
                  <TouchableOpacity 
                    key={index}
                    style={styles.columnHeader} 
                    onPress={()=> sortTable(column)}>
                    <Text style={styles.columnHeaderTxt}>{column + " "} 
                      { selectedColumn === column && <MaterialCommunityIcons 
                          name={direction === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"} 
                        />
                      }
                    </Text>
                  </TouchableOpacity>
                )
              }
            })
          }
        </View>
      )

  const [loaded] = useFonts({
    nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
    nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
  });
  if(!loaded){
    return null  
  }

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
            <TopBarText>Histórico da Bateria</TopBarText>
              
            <BatIcon 
              style={{
                transform: [
                  { scale: .8  }
                ]
              }}
            >
              <TouchableOpacity
                    onPress={() => navigation.push('HistoryLevelBatPage')}
                >
                <Image source={Battery}></Image>                                   
              </TouchableOpacity>
            </BatIcon>
          </TopBar>
          {logs.length > 0 ?(
          // {false &&(
            <FlatList 
              data={logs}
              style={{top: 20, height: '80%', width:"90%"}}
              keyExtractor={(item, index) => index+""}
              ListHeaderComponent={tableHeader}
              stickyHeaderIndices={[0]}
              renderItem={({item, index})=> {
              return (
                  <View style={{...styles.tableRow, backgroundColor: index % 2 == 1 ? "white" : "white"}}>
                      <View  style={styles.columnRowView}>
                          <Text style={styles.columnRowTxt}>{item.BatPercentage.toFixed(0)}</Text>   
                      </View> 
                      <View style={styles.columnRowView}>
                          <Text style={styles.columnRowTxt}>{item.BatVolts.toFixed(2)}</Text>   
                      </View> 
                      <View style={styles.columnRowView}>
                          <Text style={styles.columnRowTxt}>{item.Date}</Text>   
                      </View> 
                      <View style={styles.columnRowView}>
                          <Text style={styles.columnRowTxt}>{item.Hour}</Text>   
                      </View> 
                  </View>
              )
              }}
            />
          )
          :(  
            <ActivityIndicatorDiv>
                <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
            </ActivityIndicatorDiv>
          )
          }
          <StatusBar style="auto" />
        </View>
      </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#004179",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 50,
  },
  tableRow: {
    flexDirection: "row",
    height: 47,
    alignItems:"center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,    
    marginTop: 5,


    marginLeft: 2,
    marginRight: 2,
  },
  columnHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems:"center",

  },
  columnHeaderTxt: {
    color: "white",
    fontWeight: "bold",
    fontFamily: 'nunitoBold',
    fontSize: 16,
    
  },
  columnRowTxt: {
    fontFamily: 'nunitoLight',
    textAlign: "center",
    fontSize: 16,

  },
  columnRowView: {
    flex: 1,  }
});
