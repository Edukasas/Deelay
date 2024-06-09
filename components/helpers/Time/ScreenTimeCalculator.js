const screenTime = (data, installedApps) => {
    let updatedTime = 0;
    installedApps.forEach((app) => {
      let time = 0;
      const found = data.find((a) => a.app === app.packageName);
      if (found) {
        time += parseInt(found.time);
      }
      updatedTime += time;
    });
    return updatedTime;
  };
export {screenTime};