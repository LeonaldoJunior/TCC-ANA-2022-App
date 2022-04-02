import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, children } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Picker,
    TextInput,
    Alert,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components';
import Svg, { Path } from 'react-native-svg';
import _, { sortedLastIndex } from "lodash"
import { useFonts } from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Battery from '../assets/battery100.png'
import backArrow from '../assets/backArrow.png'
import manual from '../assets/manual.png'
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

export function Login({ navigation }) {


    const [loaded] = useFonts({
        nunitoLight: require("../assets/fonts/Nunito-Light.ttf"),
        nunitoBold: require("../assets/fonts/Nunito-Bold.ttf")
    });

    const [userId, setUserId] = useState("");
    const [disableLogin, setDisableLogin] = useState(true);

    const [userIdResponse, setUserIdResponse] = useState("");
    const [userIdResponseLoading, setUserIdResponseLoading] = useState(true);
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
            console.log(err)
            Alert.alert("Error Message: ", err.message);
            setUserIdResponseError(err);
        }
        finally {
            setUserIdResponseLoading(false);
        }
    }

    useEffect(() => {
        if(userIdResponse.length == 5){
            saveUSerIdLocally();
        }
    }, [userIdResponse])

    useEffect(() => {
        if (userId.length == 5) {
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
            Alert.alert("Sucesso", "Usuario Salvo")

        }
        catch (e) {
            console.log(e)
            Alert.alert(e);
        }
    }

    const onChangeUserIdInput = (inputString) => {
        setUserId(inputString);
    }


    // React.useEffect(console.log("ASDASDASDASD"))
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
                    <LabelText>ID de Usuario</LabelText>
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
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
