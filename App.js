
import React from 'react';

import { WelcomePage } from './pages/WelcomePage';
import { MyLevelPage } from './pages/MyLevelPage';
import { HistoryLevelBatPage } from './pages/HistoryLevelBatPage'
import { HistoryLevelPage } from './pages/HistoryLevelPage'
import { Devices } from './pages/Devices'
import { SetNewDevice } from './pages/SetNewDevice'
import { SetWatertankMeasures } from './pages/SetWatertankMeasures'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashPage } from './pages/SplashPage';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          {/* <Stack.Screen name="SplashPage" component={SplashPage} /> */}
          <Stack.Screen name="WelcomePage" component={WelcomePage} />
          <Stack.Screen name="MyLevelPage" component={MyLevelPage} />
          <Stack.Screen name="HistoryLevelBatPage" component={HistoryLevelBatPage} />
          <Stack.Screen name="HistoryLevelPage" component={HistoryLevelPage} />
          <Stack.Screen name="Devices" component={Devices} />
          <Stack.Screen name="SetNewDevice" component={SetNewDevice} />
          <Stack.Screen name="SetWatertankMeasures" component={SetWatertankMeasures} />
          
          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  
  
  // <WelcomePage></WelcomePage>
    // <MyLevelPage></MyLevelPage>
    // <HistoryLevelBatPage></HistoryLevelBatPage>
    // <HistoryLevelPage></HistoryLevelPage>
  );
}

