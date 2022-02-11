import AsyncStorage  from '@react-native-async-storage/async-storage';

const storeKey = 'myPreference';
const storeData = async () => {
  try {
    await AsyncStorage.setItem(storeKey, 'I like to save it.');
  } catch (error) {
    // Error saving data
  }
}

const retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem(storeKey);
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
   } catch (error) {
     // Error retrieving data
   }
}