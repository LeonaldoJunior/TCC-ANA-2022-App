import React, { Children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, StyleSheet, Image } from 'react-native';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';


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
    position: absolute;
    width: 100%;
    height: 98px;
    left: 0px;
    top: 0px;
    background: #0052B9;
`;

const TopBarText = styled.Text`
    font-family: Nunito-BoldItalic;
    font-style: normal;
    font-weight: normal;
    font-size: 40px;
    line-height: 55px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #FFFFFF;
    top: 29px;

`;

const BatIcon = styled.View`
    position: absolute;
    left: 88%;
    top: 29px;
        
`;


const ArrowIcon = styled.View`
    position: absolute;
    left: 3.73%;
    right: 82.93%;
    top: 10px;
    bottom: 93.1%;       
`;

const LevelText = styled.Text`    
    top: 150px;

    font-family: Nunito;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    
    text-align: center;

    color: #FFFFFF;
`;

// Talvez abaixar mais a caixa dagua verificar depois
const WaterTank = styled.View`
    top: 200px;
    justify-content: center;
    align-items: center; 
`;

const Buttons = styled.View`    
    top: 200px;
    justify-content: center;
    align-items: center; 
`;



export function MyLevelPage (){
    return(
        <Background>
            <TopBar>
                <BatIcon>
                    {/* Bat 100% */}
                    {/* <Svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path fillRule="evenodd" clipRule="evenodd" d="M12 2H28V5H12V2ZM10 5V2C10 0.89543 10.8954 0 12 0H28C29.1046 0 30 0.895431 30 2V5H34C37.3137 5 40 7.68629 40 11V54C40 57.3137 37.3137 60 34 60H6C2.68629 60 0 57.3137 0 54V11C0 7.68629 2.68629 5 6 5H10ZM6 8.5H34C35.3807 8.5 36.5 9.61929 36.5 11V54C36.5 55.3807 35.3807 56.5 34 56.5H6C4.61929 56.5 3.5 55.3807 3.5 54V11C3.5 9.61929 4.61929 8.5 6 8.5ZM5 49C5 47.8954 5.89543 47 7 47H33C34.1046 47 35 47.8954 35 49V53C35 54.1046 34.1046 55 33 55H7C5.89543 55 5 54.1046 5 53V49ZM5 40C5 38.8954 5.89543 38 7 38H33C34.1046 38 35 38.8954 35 40V44C35 45.1046 34.1046 46 33 46H7C5.89543 46 5 45.1046 5 44V40ZM7 28C5.89543 28 5 28.8954 5 30V35C5 36.1046 5.89543 37 7 37H33C34.1046 37 35 36.1046 35 35V30C35 28.8954 34.1046 28 33 28H7ZM5 21C5 19.8954 5.89543 19 7 19H33C34.1046 19 35 19.8954 35 21V25C35 26.1046 34.1046 27 33 27H7C5.89543 27 5 26.1046 5 25V21ZM7 10C5.89543 10 5 10.8954 5 12V16C5 17.1046 5.89543 18 7 18H33C34.1046 18 35 17.1046 35 16V12C35 10.8954 34.1046 10 33 10H7Z" fill="white"/>
                    </Svg> */}

                    {/* Bat 80% */}
                    {/* <Svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path fillRule="evenodd" clipRule="evenodd" d="M28 2H12V5H28V2ZM10 2V5H6C2.68629 5 0 7.68629 0 11V54C0 57.3137 2.68629 60 6 60H34C37.3137 60 40 57.3137 40 54V11C40 7.68629 37.3137 5 34 5H30V2C30 0.895431 29.1046 0 28 0H12C10.8954 0 10 0.89543 10 2ZM34 8.5H6C4.61929 8.5 3.5 9.61929 3.5 11V54C3.5 55.3807 4.61929 56.5 6 56.5H34C35.3807 56.5 36.5 55.3807 36.5 54V11C36.5 9.61929 35.3807 8.5 34 8.5ZM7 47C5.89543 47 5 47.8954 5 49V53C5 54.1046 5.89543 55 7 55H33C34.1046 55 35 54.1046 35 53V49C35 47.8954 34.1046 47 33 47H7ZM7 38C5.89543 38 5 38.8954 5 40V44C5 45.1046 5.89543 46 7 46H33C34.1046 46 35 45.1046 35 44V40C35 38.8954 34.1046 38 33 38H7ZM5 30C5 28.8954 5.89543 28 7 28H33C34.1046 28 35 28.8954 35 30V35C35 36.1046 34.1046 37 33 37H7C5.89543 37 5 36.1046 5 35V30ZM7 19C5.89543 19 5 19.8954 5 21V25C5 26.1046 5.89543 27 7 27H33C34.1046 27 35 26.1046 35 25V21C35 19.8954 34.1046 19 33 19H7Z" fill="white"/>
                    </Svg> */}

                    {/* Bat 60% */}
                    {/* <Svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path fillRule="evenodd" clipRule="evenodd" d="M12 2H28V5H12V2ZM10 5V2C10 0.89543 10.8954 0 12 0H28C29.1046 0 30 0.895431 30 2V5H34C37.3137 5 40 7.68629 40 11V54C40 57.3137 37.3137 60 34 60H6C2.68629 60 0 57.3137 0 54V11C0 7.68629 2.68629 5 6 5H10ZM6 8.5H34C35.3807 8.5 36.5 9.61929 36.5 11V54C36.5 55.3807 35.3807 56.5 34 56.5H6C4.61929 56.5 3.5 55.3807 3.5 54V11C3.5 9.61929 4.61929 8.5 6 8.5ZM5 49C5 47.8954 5.89543 47 7 47H33C34.1046 47 35 47.8954 35 49V53C35 54.1046 34.1046 55 33 55H7C5.89543 55 5 54.1046 5 53V49ZM5 40C5 38.8954 5.89543 38 7 38H33C34.1046 38 35 38.8954 35 40V44C35 45.1046 34.1046 46 33 46H7C5.89543 46 5 45.1046 5 44V40ZM7 28C5.89543 28 5 28.8954 5 30V35C5 36.1046 5.89543 37 7 37H33C34.1046 37 35 36.1046 35 35V30C35 28.8954 34.1046 28 33 28H7Z" fill="white"/>
                    </Svg> */}

                    {/* Bat 40% */}
                        {/* <Svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path fillRule="evenodd" clipRule="evenodd" d="M28 2H12V5H28V2ZM10 2V5H6C2.68629 5 0 7.68629 0 11V54C0 57.3137 2.68629 60 6 60H34C37.3137 60 40 57.3137 40 54V11C40 7.68629 37.3137 5 34 5H30V2C30 0.895431 29.1046 0 28 0H12C10.8954 0 10 0.89543 10 2ZM34 8.5H6C4.61929 8.5 3.5 9.61929 3.5 11V54C3.5 55.3807 4.61929 56.5 6 56.5H34C35.3807 56.5 36.5 55.3807 36.5 54V11C36.5 9.61929 35.3807 8.5 34 8.5ZM7 47C5.89543 47 5 47.8954 5 49V53C5 54.1046 5.89543 55 7 55H33C34.1046 55 35 54.1046 35 53V49C35 47.8954 34.1046 47 33 47H7ZM7 38C5.89543 38 5 38.8954 5 40V44C5 45.1046 5.89543 46 7 46H33C34.1046 46 35 45.1046 35 44V40C35 38.8954 34.1046 38 33 38H7Z" fill="white"/>
                    </Svg> */}

                    {/* Bat 20% */}
                    <Svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path fillRule="evenodd" clipRule="evenodd" d="M12 2H28V5H12V2ZM10 5V2C10 0.89543 10.8954 0 12 0H28C29.1046 0 30 0.895431 30 2V5H34C37.3137 5 40 7.68629 40 11V54C40 57.3137 37.3137 60 34 60H6C2.68629 60 0 57.3137 0 54V11C0 7.68629 2.68629 5 6 5H10ZM6 8.5H34C35.3807 8.5 36.5 9.61929 36.5 11V54C36.5 55.3807 35.3807 56.5 34 56.5H6C4.61929 56.5 3.5 55.3807 3.5 54V11C3.5 9.61929 4.61929 8.5 6 8.5ZM5 49C5 47.8954 5.89543 47 7 47H33C34.1046 47 35 47.8954 35 49V53C35 54.1046 34.1046 55 33 55H7C5.89543 55 5 54.1046 5 53V49Z" fill="white"/>
                    </Svg>
                    
                </BatIcon>

                {/* <ArrowIcon>
                    <Svg width="56" height="48" viewBox="0 0 56 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path fillRule="evenodd" clipRule="evenodd" d="M53 24H3.00008Z" fill="white"/>
                        <Path d="M53 24H3.00008" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                        <Path fillRule="evenodd" clipRule="evenodd" d="M3.00007 24L28.1946 3Z" fill="white"/>
                        <Path d="M3.00007 24L28.1946 3" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                        <Path fillRule="evenodd" clipRule="evenodd" d="M3.00007 24L28.1946 45Z" fill="white"/>
                        <Path d="M3.00007 24L28.1946 45" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                </ArrowIcon> */}

            <TopBarText>Meu nível</TopBarText></TopBar>

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
                <Image source={require('../assets/waterTank50.png')}/>
                {/* <Image source={require('../assets/waterTank45.png')}/> */}
                {/* <Image source={require('../assets/waterTank40.png')}/> */}
                {/* <Image source={require('../assets/waterTank35.png')}/> */}
                {/* <Image source={require('../assets/waterTank30.png')}/> */}
                {/* <Image source={require('../assets/waterTank25.png')}/> */}
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
                <Image source={require('../assets/historyButton.png')}/>
            </Buttons>
        </Background>
    )
}