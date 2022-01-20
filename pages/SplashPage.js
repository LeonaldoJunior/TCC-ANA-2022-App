
import React, {useEffect, useRef, Children} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Animated, Image, Dimensions } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../assets/anaIcon.png'
import Svg, { Path } from 'react-native-svg';


const Background = ({ children }) => {
    return(
        <LinearGradient     
        colors={['#04A1FF','#8BD3FF','#FFFFFF']}
        // colors={['#0052B9','#0052B9']}
        style={{
            flex: 1,

        }}
        >

            {children}
        </LinearGradient>
    )
}




export function SplashPage(){
    const edges = useSafeAreaInsets();

    const BGColor = "#0052B9"

    // Animation Values...
    const startAnimation = useRef(new Animated.Value(0)).current;
    
    const scaleLogo = useRef(new Animated.Value(1)).current;
    // const scaleTitle = useRef(new Animated.Value(1)).current;

    const moveLogo = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
    // const moveTitle = useRef(new Animated.Value({x: 0, y: 0})).current;


    useEffect(()=>{
        setTimeout(()=>{
            Animated.parallel([
                 Animated.timing(
                     startAnimation,
                     {
                         toValue: -Dimensions.get('window').height + (edges.top + 65),
                         useNativeDriver: true
                     }
                 ),
                 Animated.timing(
                     scaleLogo,
                     {
                         toValue: 0.25,
                         useNativeDriver: true
                     }
                 ),
                 Animated.timing(
                     moveLogo,
                     {
                         toValue: {
                             x: -(Dimensions.get('window').width /2) + 45,
                             y: (Dimensions.get('window').height /2) - 35
                         },
                         useNativeDriver: true
                     }
                 ),            
            ]).start();
        },500)
    },[])


    // Going to Move Up Like Nav Bar...
    return(
        <Animated.View style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: BGColor,
            transform: [
                {   translateY: startAnimation  }
            ]


        }}

        
        >
            {/* <Background> */}
                <Animated.View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // transform: [
                    //     { translateY: startAnimation  }
                    // ]
                }}>
                    {/* <Animated.Image source={Logo} style={{
                        // transform: [
                        //     {scale: scaleLogo}
                        // ]
                    }}
                    ></Animated.Image> */}
                    
                    <Animated.View style={{
                        transform: [
                            {translateX: moveLogo.x},   
                            {translateY: moveLogo.y},   
                            {scale: scaleLogo},
                        ]
                    }}
                    >
                        <Svg width="262" height="162" viewBox="0 0 262 162" >  
                            <Path stroke="white" strokeWidth="5" strokeLinecap="round" d="M48.5 118L56.4883 98.1598M95.5 118L87.8733 98.1598M56.4883 98.1598L70.6249 59.7201C71.2721 57.9601 73.7679 57.9786 74.3891 59.748L87.8733 98.1598M56.4883 98.1598H87.8733M109.103 118V61.3251C109.103 59.3274 111.71 58.5641 112.787 60.246L149.213 117.09C150.29 118.772 152.897 118.008 152.897 116.011V59M165 118L172.773 98.1598M172.773 98.1598L187.126 59.7126C187.782 57.9555 190.278 57.9865 190.89 59.7594L210.535 116.653C210.813 117.459 211.572 118 212.425 118H223.983C225.27 118 226.222 119.198 225.931 120.452L221.061 141.443C219.792 144.987 215.349 153.82 207.733 154.732C198.213 155.871 171.175 157.01 138.807 157.769C106.438 158.528 71.7841 157.389 59.5982 154.732C47.4123 152.074 44.3658 150.176 41.3193 141.443C38.931 134.597 28.5459 82.7084 23.3524 56.0967C23.169 55.1573 22.3496 54.497 21.3924 54.497H6C4.89543 54.497 4 53.6016 4 52.497V42.4894C4 41.5266 4.68604 40.7004 5.63248 40.5235L15.3957 38.6983C15.9028 38.6035 16.3536 38.3165 16.6541 37.8971L27.1735 23.2137C27.4551 22.8207 27.8694 22.543 28.3399 22.4319L106.211 4.05348C106.362 4.01794 106.516 4 106.671 4H155.327C155.483 4 155.639 4.01829 155.791 4.05448L232.998 22.4539C233.408 22.5516 233.776 22.7762 234.051 23.0956L246.898 38.0394C247.183 38.371 247.569 38.6001 247.997 38.6914L256.418 40.4906C257.341 40.6878 258 41.5029 258 42.4465V52.497C258 53.6016 257.105 54.497 256 54.497H240.979C240.026 54.497 239.205 55.1693 239.018 56.1036L230.904 96.5532C230.717 97.4875 229.896 98.1598 228.943 98.1598H172.773Z" ></Path> 
                        </Svg> 
                    </Animated.View>
                </Animated.View>

            {/* </Background> */}


        </Animated.View>
    )
}