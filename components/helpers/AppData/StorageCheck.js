import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to check AsyncStorage contents
const checkStorageContents = async () => {
  try {
    // Get all keys
    const keys = await AsyncStorage.getAllKeys();

    // Get all items
    const items = await AsyncStorage.multiGet(keys);

    console.log('AsyncStorage contents:');
    items.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } catch (error) {
    console.error('Error checking AsyncStorage contents:', error);
  }
};
export {checkStorageContents};