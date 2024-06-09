import AsyncStorage from '@react-native-async-storage/async-storage'; 
const loadCategories = async (setCategories, setLoading = null, setError = null) => {
  try {
    const storedCategories = await AsyncStorage.getItem('categories');
    const parsedCategory = storedCategories ? JSON.parse(storedCategories) : [];
    setCategories(parsedCategory);
  } catch (categoryError) {
    setError && setError(categoryError.message || 'Error fetching category');
  } finally {
    setLoading && setLoading(false);
  }
};
export {loadCategories};