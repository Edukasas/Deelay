export default resolveDate = (idx, date = null) => {
    const thisDate = date ? new Date(date) : new Date();
    thisDate.setDate(thisDate.getDate() + idx);
    thisDate.setMinutes(0);
    thisDate.setHours(0);
    
    return thisDate.getTime();
  }