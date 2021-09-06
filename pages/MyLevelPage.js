import React, { Children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
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

const TopBar = styled.View`
    flex-direction: row;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 98px;
    background: #0052B9;
    align-items: center;
    
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
    left: 90%;
  
`;
const BatIcon = styled.View`
  top: 10px;
  left: 130%;
`;



const LevelText = styled.Text`    

    font-family: Nunito;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    
    text-align: center;

    color: #FFFFFF;
`;

// Talvez abaixar mais a caixa dagua verificar depois
const WaterTank = styled.View`
    justify-content: center;
    align-items: center; 
`;

const Buttons = styled.View`    
    justify-content: center;
    align-items: center; 
`;



export function MyLevelPage( {navigation} ){
    return(
        <Background>
            <TopBar>
              <TopBarText>Histórico do nível</TopBarText>
              
              <BatIcon>
                <TouchableOpacity
                    onPress={ () => navigation.navigate('HistoryLevelBatPage')}
                >
                  <Image source={Battery}></Image>                                   
                </TouchableOpacity>
              </BatIcon>
            </TopBar>

                <LevelText>
                    Leitura atual
                    {"\n"}
                    xx:xx
                    {"\n"}
                    xx/xx/xxxx
                </LevelText>
            <WaterTank>
                {/* <Image source={require('../assets/waterTank100.png')}/> */}
                {/* <Image source={require('../assets/waterTank95.png')}/> */}
                {/* <Image source={require('../assets/waterTank90.png')}/> */}
                {/* <Image source={require('../assets/waterTank85.png')}/> */}
                {/* <Image source={require('../assets/waterTank80.png')}/> */}
                {/* <Image source={require('../assets/waterTank75.png')}/> */}
                {/* <Image source={require('../assets/waterTank70.png')}/> */}
                {/* <Image source={require('../assets/waterTank65.png')}/> */}
                {/* <Image source={require('../assets/waterTank60.png')}/> */}
                {/* <Image source={require('../assets/waterTank50.png')}/> */}
                {/* <Image source={require('../assets/waterTank45.png')}/> */}
                {/* <Image source={require('../assets/waterTank40.png')}/> */}
                {/* <Image source={require('../assets/waterTank35.png')}/> */}
                {/* <Image source={require('../assets/waterTank30.png')}/> */}
                <Image source={require('../assets/waterTank25.png')}/>
                {/* <Image source={require('../assets/waterTank20.png')}/> */}
                {/* <Image source={require('../assets/waterTank15.png')}/> */}
                {/* <Image source={require('../assets/waterTank10.png')}/> */}
                {/* <Image source={require('../assets/waterTank5.png')}/> */}
                {/* <Image source={require('../assets/waterTank0.png')}/> */}
            </WaterTank>

            <Buttons>
                <Image 
                style={{ margin: 20 }}
                source={require('../assets/settingsButton.png')}/>

                <TouchableOpacity
                    onPress={ () => navigation.navigate('HistoryLevelPage')}
                >
                    <Image source={require('../assets/historyButton.png')}/>

                </TouchableOpacity>


            </Buttons>
        </Background>
    )
}
