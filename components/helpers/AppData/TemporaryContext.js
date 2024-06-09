import React, { createContext, useReducer, useContext } from 'react';

const TemporaryContext = createContext();

const temporaryInitialState = {
    customCategoryName: '',
    selectedApps: [],
    usageTime: 0,
    blockedTime: 0,
    editingCategory: null,
    editingCategoryKey: null,
    goingBack: true,
};

const temporaryReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CUSTOM_CATEGORY_NAME':
        return {
          ...state,
          customCategoryName: action.payload,
        };
      case 'SET_SELECTED_APPS':
        return {
          ...state,
          selectedApps: action.payload,
        };
      case 'USAGE_TIME_MINUTES':
        return {
          ...state,
          usageTimeMinutes: action.payload,
        };
      case 'BLOCKED_TIME_MINUTES':
        return {
          ...state,
          blockedTimeMinutes: action.payload,
        };
        case 'USAGE_TIME_SECONDS':
          return {
            ...state,
            usageTimeSeconds: action.payload,
          };
        case 'BLOCKED_TIME_SECONDS':
          return {
            ...state,
            blockedTimeSeconds: action.payload,
          };
          case 'SET_EDITING_CATEGORY':
            return { ...state,
               editingCategory: action.payload };
           case 'SET_EDITING_CATEGORY_KEY':
             return { ...state,
              editingCategoryKey: action.payload };
         case 'COMING_BACK_WHEN_EDITING':
             return { ...state,
              goingBack: action.payload };

        case 'RESET_TEMPORARY_DATA':
            return temporaryInitialState;
    default:
      return state;
  }
};
export const TemporaryProvider = ({ children }) => {
  const [temporaryState, temporaryDispatch] = useReducer(
    temporaryReducer,
    temporaryInitialState
  );
  return (
    <TemporaryContext.Provider value={{ temporaryState, temporaryDispatch }}>
      {children}
    </TemporaryContext.Provider>
  );
};

export const useTemporaryContext = () => {
  const context = useContext(TemporaryContext);
  if (!context) {
    throw new Error('useTemporaryContext must be used within a TemporaryProvider');
  }
  return context;
};
