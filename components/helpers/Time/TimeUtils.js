const calculateHoursAndMinutes = (screenTime) => {
    const hours = Math.floor(screenTime / 3600);
    const minutes = Math.floor((screenTime % 3600) / 60);
    const formatPlural = (value, unit) => `${value} ${value === 1 ? unit : unit + 's'}`;
  
    if (hours > 0) {
      return `${formatPlural(hours, 'hour')} ${formatPlural(minutes, 'minute')}`;
    } else {
      return `${formatPlural(minutes, 'minute')}`;
    }
  };
export {calculateHoursAndMinutes};