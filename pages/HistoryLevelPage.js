import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
import _ from "lodash"
import backArrow from '../assets/backArrow.png'
import Battery from '../assets/battery100.png'


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

// position: absolute;
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
    font-family: Nunito-BoldItalic;
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    line-height: 55px;
    align-items: center;
    text-align: center;
    color: #FFFFFF;
    top: 10px;
    right: 10px;

`;

// position: absolute;
const BatIcon = styled.View`
  right: 10px
  top: 10px;

`;
// position: absolute;
// left: 3.73%;
// right: 82.93%;
// top: 10px;
// bottom: 93.1%;  
const ArrowIcon = styled.View`  
  left: 10px
  top: 12px;
`;


export function HistoryLevelPage( {navigation} ) {

    const [ columns, setColumns ] = useState([
        "Nível(cm)",
        "Hora",
        "Data",
      ])
      const [ direction, setDirection ] = useState(null)
      const [ selectedColumn, setSelectedColumn ] = useState(null)
      const [ logs, setlogs ] = useState([
        {
            Nivel: "20",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Nivel: "30",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Nivel: "40",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Nivel: "50",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Nivel: "60",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Nivel: "70",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Nivel: "85",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Nivel: "90",
            Hora: "04:00",
            Data: "04/09/2021",
        },
        {
            Nivel: "100",
            Hora: "04:00",
            Data: "04/09/2021",
        },
      ])
    
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
  
  return (
      <Background>
        <View style={styles.container}>
            <TopBar>
              <ArrowIcon>
                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
                >
                  <Image 
                    source={backArrow}></Image>                                   
                </TouchableOpacity>
              </ArrowIcon>

              <TopBarText>Histórico do nível</TopBarText>
              
              <BatIcon>
                <TouchableOpacity
                    onPress={ () => navigation.navigate('HistoryLevelBatPage')}
                >
                  <Image source={Battery}></Image>                                   
                </TouchableOpacity>
              </BatIcon>
            </TopBar>
            
            <FlatList 
                data={logs}
                style={{width:"90%"}}
                keyExtractor={(item, index) => index+""}
                ListHeaderComponent={tableHeader}
                stickyHeaderIndices={[0]}
                renderItem={({item, index})=> {
                return (
                    <View style={{...styles.tableRow, backgroundColor: index % 2 == 1 ? "white" : "white"}}>
                        <View  style={styles.columnRowView}>
                            <Text style={styles.columnRowTxt}>{item.Nivel}</Text>   
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeader: {
    flexDirection: "row",
    marginTop: 20,
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 5,
  },
  columnHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems:"center",

  },
  columnHeaderTxt: {
    color: "white",
    fontWeight: "bold",
    
    fontSize: 18,
    
  },
  columnRowTxt: {
    textAlign: "center",
    fontSize: 18,

  },
  columnRowView: {
    flex: 1,  }
});
