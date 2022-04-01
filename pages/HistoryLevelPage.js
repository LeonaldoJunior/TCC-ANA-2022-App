import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
import _ from "lodash"
import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import { useFonts } from 'expo-font'

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

export function HistoryLevelPage( {navigation} ) {
  const [selectedDevice ,setSelectedDevice] = useState({});
  const [endDeviceData, setEndDeviceData] = useState({});

  useEffect(()=>{
    // const interval = setInterval(() => {
    //     const baseURL= "https://2833-2001-1284-f016-a1b0-2ca1-bbb7-1c46-9a84.ngrok.io/WebHook?id=eui-70b3d57ed0046195";

        
    //     console.log("call API")
    //     fetch(baseURL)
    //         .then(resp => resp.json())
    //         .then(json => {
    //             console.log("json")
    //             console.log(json)
    //             setEndDeviceData(json)
    //         })  
    // }, 10000);
    // return () => clearInterval(interval);
  },[])

  useEffect(()=>{
    console.log(endDeviceData)
  },[endDeviceData])


    const [ columns, setColumns ] = useState([
        "Nível(%)",
        "Hora",
        "Data",
      ])
      const [ direction, setDirection ] = useState(null)
      const [ selectedColumn, setSelectedColumn ] = useState(null)

      // useEffect(() => {
      //   const unsubscribe = navigation.addListener('focus', () => {
      //       retrieveDevicecSelected();
      //   });
      //   return unsubscribe;
      // }, [navigation]);

      const formatDate = (date) =>{
        let yyyy = date.substring(0,4);
        let mm    = date.substring(5,7);
        let dd    = date.substring(8,10);
        return `${dd}\\${mm}\\${yyyy}`;
      }

      const formatHour = (date) =>{
        return date.substring(11,19);
      }

      const maxVolume = (date) =>{
        return date.substring(11,19);
      }
      const maxVolumeCalculation = () =>{
        if(selectedDevice.deviceId){
            let baseRadius = selectedDevice.selectedWaterTank.raioBase;
            let height = selectedDevice.selectedWaterTank.altura;
            let topRadius = selectedDevice.selectedWaterTank.raioTopo;
            

            
            
            let maxVolume = (Math.PI * height)*(Math.pow(baseRadius,2) + (baseRadius*topRadius) + Math.pow(topRadius,2))/3
            
            // console.log("baseRadius: ", baseRadius)
            // console.log("height: ", height)
            // console.log("topRadius: ", topRadius)
            // console.log("maxVolume: ", maxVolume)
            return maxVolume;
            // return (Math.PI * height)*(Math.pow(baseRadius,2) + (baseRadius*topRadius) + Math.pow(topRadius,2))/3
        }

        return 0;

    }

    
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

    const currentVolume = (date) =>{
      return date.substring(11,19);
    }

      const relativeVolume = (date) =>{
        return date.substring(11,19);
      }


      const sortTable = (column) => {
        const newDirection = direction === "desc" ? "asc" : "desc" 
        const sortedData = _.orderBy(endDeviceData, [column],[newDirection])
        setSelectedColumn(column)
        setDirection(newDirection)
        setEndDeviceData(sortedData)
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
            <TopBarText>Histórico do Nível</TopBarText>
              
            <BatIcon 
              style={{
                transform: [
                  { scale: .8  }
                ]
              }}
            >
              <TouchableOpacity
                    onPress={() => navigation.navigate('HistoryLevelBatPage')}
                >
                <Image source={Battery}></Image>                                   
              </TouchableOpacity>
            </BatIcon>
          </TopBar>
          {endDeviceData.length > 0 &&(
            <FlatList 
              data={endDeviceData}
              style={{top: 20, height: '80%', width:"90%"}}
              keyExtractor={(item, index) => index+""}
              ListHeaderComponent={tableHeader}
              stickyHeaderIndices={[0]}
              renderItem={({item, index})=> {
              return (
                  <View style={{...styles.tableRow, backgroundColor: index % 2 == 1 ? "white" : "white"}}>
                      <View  style={styles.columnRowView}>
                          <Text style={styles.columnRowTxt}>{item.analogIn1}</Text>   
                      </View> 
                      <View style={styles.columnRowView}>
                          <Text style={styles.columnRowTxt}>{formatHour(item.receivedAt)}</Text>   
                      </View> 
                      <View style={styles.columnRowView}>
                          <Text style={styles.columnRowTxt}>{formatDate(item.receivedAt)}</Text>   
                      </View> 
                  </View>
              )
              }}
            />

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
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#004179",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    height: 50
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
    fontSize: 18,
    
  },
  columnRowTxt: {
    fontFamily: 'nunitoLight',
    textAlign: "center",
    fontSize: 18,

  },
  columnRowView: {
    flex: 1,  }
});
