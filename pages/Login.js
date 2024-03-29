import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import styled from 'styled-components';
import { useFonts } from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import login from '../assets/login.png'
import loginDisabled from '../assets/loginDisabled.png'

import GetUserbyID from '../services/GetUserbyID'

const Background = ({ children }) => {
    return (
        <LinearGradient
            colors={['#04A1FF', '#8BD3FF', '#FFFFFF']}
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

const InputView = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 98px;
  align-items: center;
`;

const ButtonView = styled.View`
  top: 30px;
  margin: 10px;
`

const LabelText = styled.Text`
  font-style: normal;
  font-size: 18px;
  line-height: 22px;
  margin :20px;
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
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export function Login({ navigation }) {

    const [userId, setUserId] = useState("");
    const [disableLogin, setDisableLogin] = useState(true);

    const [userIdResponse, setUserIdResponse] = useState("");
    const [userIdResponseLoading, setUserIdResponseLoading] = useState(false);
    const [userIdResponseError, setUserIdResponseError] = useState({});

    const hangleCheckUserId = async () => {
        try {
            setUserIdResponseLoading(true);
            const [user] = await Promise.all([
                GetUserbyID(userId)
            ]);
            setUserIdResponse(user.data)
        }
        catch (err) {
            if(err.message === "Request failed with status code 404"){
              Alert.alert("Mensagem de erro: ", "Desculpe não foi encontrado o usuário tente novamente.");
            }else if(err.message === "Request failed with status code 502."){
              Alert.alert("Mensagem de erro: ", "Desculpe estamos tendo problemas com a conexão, certifique-se que está conectado a internet e tente novamente!");
            }else{
              Alert.alert("Mensagem de erro: ", err.message);
            }
            setUserIdResponseError(err);
        }
        finally {
            setUserIdResponseLoading(false);
        }
    }

    useEffect(() => {
        if(userIdResponse.length == 10){
            saveUSerIdLocally();
        }
    }, [userIdResponse])

    useEffect(() => {
        if (userId.length == 10) {
            setDisableLogin(false);
        }
        else {
            setDisableLogin(true);
        }
    }, [userId])



    const saveUSerIdLocally = async () => {
        try {
            await AsyncStorage.setItem('@loggedUserId', JSON.stringify(userIdResponse))
            Keyboard.dismiss()
            Alert.alert("Código válido", "usuário autenticado com sucesso.")
            setTimeout(() => {navigation.navigate('MyLevelPage')}, 2000);      
}
        catch (e) {
            console.log(e)
            Alert.alert(e);
        }
    }

    const redirectToMyLevelPage = () => {
        navigation.navigate('HistoryLevelBatPage')
    }

    const onChangeUserIdInput = (inputString) => {
        setUserId(inputString);
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
            {!userIdResponseLoading 
            ? (
                <View style={styles.container}>

                    <TopBar>
                        <ArrowIcon>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                            >
                                <Image source={backArrow}></Image>
                            </TouchableOpacity>
                        </ArrowIcon>
                        <TopBarText>Entrar</TopBarText>

                        <BatIcon
                            style={{
                                transform: [
                                    { scale: .8 }
                                ]
                            }}
                        >
                            <TouchableOpacity onPress={() => navigation.navigate('HistoryLevelBatPage')}>
                                <Image source={Battery}></Image>
                            </TouchableOpacity>
                        </BatIcon>
                    </TopBar>
                    <InputView>
                        <LabelText>ID de usuário</LabelText>
                        <TextInput
                            onChangeText={onChangeUserIdInput}
                            value={userId}
                            placeholder="id"
                            keyboardType="default"
                        />
                    </InputView>

                    {!disableLogin
                        ? (
                            <ButtonView>
                                <TouchableOpacity
                                    onPress={hangleCheckUserId}
                                >
                                    <Image source={login}></Image>
                                </TouchableOpacity>
                            </ButtonView>
                        ) : (
                            <ButtonView>
                                <Image source={loginDisabled}></Image>
                            </ButtonView>
                        )}




                    <StatusBar style="auto" />
                </View>
            )
            :(
                <ActivityIndicatorDiv>
                    <ActivityIndicator size="large" color="#ffffff"></ActivityIndicator>
                </ActivityIndicatorDiv>
            )
            }
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
