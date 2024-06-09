import React, { useState } from 'react';
import { View } from 'react-native';
import AddAppsForm from '../../FormComponents/AddAppsForm';
import TimeForm from '../../FormComponents/TimeForm';
import { TemporaryProvider } from '../../helpers/AppData/TemporaryContext';

const AddCategory = ({ update, onCancel, categoryToEdit }) => {

  const [showTimeForm, setShowTimeForm] = useState(false);
  const handleAddAppsSubmit = () => {
    setShowTimeForm(true);
  };
  const handleReturn = () => {
    setShowTimeForm(false);
  };
  return (
      <TemporaryProvider>
    <View>
      {showTimeForm ?
       <TimeForm update={update} returnToApps={handleReturn} categoryToEdit={categoryToEdit}/> : <AddAppsForm onSubmit={handleAddAppsSubmit} onCancel={onCancel} categoryToEdit={categoryToEdit} /> }
    </View>
    </TemporaryProvider>
  );
};

export default AddCategory;
