import { NativeModules } from 'react-native';
async function getUsageStats(startTime, endTime) {
  const { UsageStatsModule } = NativeModules;
  return new Promise((resolve) => {
    UsageStatsModule.getStats(startTime, endTime, stats => {
      try {
        const appUsage = [];
        let apps = stats.split(',');
        apps.forEach(app => {
          let appStats = app.split(':');
          if (appStats[1] > 0) {
            appUsage.push({
              app: appStats[0],
              time: Number(appStats[1]) / 1000,
            });
          }
        });
        resolve(appUsage);
      } catch (error) {
        console.log('error');
      }
    });
  });
}

export { getUsageStats };
