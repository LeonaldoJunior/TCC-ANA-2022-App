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

export function HistoryLevelBatPage( {navigation} ) {

    const [ columns, setColumns ] = useState([
        "Bateria(%)",
        "Hora",
        "Data",
      ])
      const [ direction, setDirection ] = useState(null)
      const [ selectedColumn, setSelectedColumn ] = useState(null)
      const [ logs, setlogs ] = useState([
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "70%",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        
        {
            Bateria: "80%",
            Hora: "03:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "90%",
            Hora: "02:00",
            Data: "04/09/2021",
        },
        {
            Bateria: "100%",
            Hora: "01:00",
            Data: "04/09/2021",
        },
        {
          Bateria: "90%",
          Hora: "02:00",
          Data: "04/09/2021",
        },
        {
          Bateria: "90%",
          Hora: "02:00",
          Data: "04/09/2021",
        },
        {
          Bateria: "90%",
          Hora: "02:00",
          Data: "04/09/2021",
        },
        {
          Bateria: "90%",
          Hora: "02:00",
          Data: "04/09/2021",
        },
        {
          Bateria: "90%",
          Hora: "02:00",
          Data: "04/09/2021",
        },
        {
          Bateria: "90%",
          Hora: "02:00",
          Data: "04/09/2021",
        },
        {
          Bateria: "90%",
          Hora: "02:00",
          Data: "04/09/2021",
        },
      ])


    // const isLoggedIn = this.state.isLoggedIn;
    let backArrowIcon;
    if (true) {
        backArrowIcon = 
        <ArrowIcon>
            <TouchableOpacity
                // onPress={ () => navigation.navigate('HistoryLevelBatPage')}
                onPress={() => navigation.goback()}
            >
            <Image source={backArrow}></Image>                                   
            </TouchableOpacity>
        </ArrowIcon>
    } else {
        backArrowIcon = 
        <ArrowIcon>
            <TouchableOpacity
                onPress={ () => navigation.navigate('HistoryLevelBatPage')}
            >
            <Image source={backArrow}></Image>                                   
            </TouchableOpacity>
        </ArrowIcon>      
    }
    
      const sortTable = (column) => {
        const newDirection = direction === "desc" ? "asc" : "desc" 
        const sortedData = _.orderBy(logs, [column],[newDirection])
        setSelectedColumn(column)
        setDirection(newDirection)
        setlogs(sortedData)
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
                    // onPress={ () => navigation.navigate('HistoryLevelBatPage')}
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
                <Image source={Battery}></Image>                                   
            </BatIcon>
          </TopBar>

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
                        <Text style={styles.columnRowTxt}>{item.Bateria}</Text>   
                    </View> 
                    <View style={styles.columnRowView}>
                        <Text style={styles.columnRowTxt}>{item.Data}</Text>   
                    </View> 
                    <View style={styles.columnRowView}>
                        <Text style={styles.columnRowTxt}>{item.Hora}</Text>   
                    </View> 
                </View>
            )
            }}
          />
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
