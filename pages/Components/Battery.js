import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useFonts } from 'expo-font'

const Battery = (props) =>{
    
    const [isLoading, setIsLoading] = useState(false);
    const [levelImage, setLevelImage] = useState(require("../../assets/battery0.png"));
    
    const maxBatVolts = 4;
    
    const images = {
      100:  require("../../assets/battery100.png"),
      80:  require("../../assets/battery80.png"),
      60:  require("../../assets/battery60.png"),
      40:  require("../../assets/battery40.png"),
      20:  require("../../assets/battery20.png"),
      0:  require("../../assets/battery0.png")
    }
    {/* <Image source={require('../../assets/waterTank100.png')}/> */}
    
    
    useEffect(() => {
        console.log("props.currentBatLevel");
        console.log(props.currentBatLevel);
    },[props.currentBatLevel])
    
    
    
    useEffect(() => {
        if(props.currentBatLevel >= 0){
            let batLevelPercentage = props.currentBatLevel/maxBatVolts * 100
            let roundedNumber = Math.round(batLevelPercentage/20)*20

            console.log("batLevelPercentage",batLevelPercentage)
            console.log("roundedNumber",roundedNumber)
            setLevelImage(images[roundedNumber])
        }
    },[props.currentBatLevel])
    
    
    const [loaded] = useFonts({
        nunitoLight: require("../../assets/fonts/Nunito-Light.ttf"),
        nunitoBold: require("../../assets/fonts/Nunito-Bold.ttf")
    });
    
    if(!loaded){
    return null  
    }
    
    
    return(
        <Image source={levelImage}/>      
    )
} 

export default Battery;