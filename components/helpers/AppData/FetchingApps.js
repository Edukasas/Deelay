import { InstalledApps } from 'react-native-launcher-kit';

const fetchInstalledApps = async (setInstalledApps, setLoading = null, setError = null) => {
  try {
    const apps = InstalledApps.getApps();
    setInstalledApps(apps);
    setLoading && setLoading(false);
  } catch (error) {
    console.error('Error fetching installed apps:', error);
    setError && setError(error.message || 'Error fetching apps');
    setLoading && setLoading(false);
  }
};
export {fetchInstalledApps};