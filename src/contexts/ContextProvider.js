import React, { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [poper, setPoper] = useState(false);
  const [initialVal, setInitialVal] = useState(null);
  const [propsID, setPropsID] = useState('0');
  const [type, setType] = useState('add');
  const [online, setOnline] = useState(false);
  const [Actions, setActions] = useState(null);
  const [API, setAPI] = useState({
    Local_Host_Name : "http://192.168.0.222/api_presences/public",
});
const [UserR, setUserR] = useState("no");


const appi = localStorage.getItem("api");

useEffect(() => {
  if (appi != '' && appi != null) {
    setAPI({
      Local_Host_Name : appi,
    });
  }
}, [appi])
  // let API = 

const setApiper = (Apivalue) => {
  setAPI({
    Local_Host_Name : Apivalue,
  });
  localStorage.setItem("api", Apivalue);
}

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const setPoperPop = (act, initialValue, id) => {
    setPoper(act);
    setInitialVal(initialValue);
    // console.error(id)
    setPropsID(id);
  };

  const handleClick = (clicked) =>
    setIsClicked({
      ...initialState,
      [clicked]: true,
    });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      value={{
        UserR,
        setUserR,
        API,
        setApiper,
        Actions,
        setActions,
        online,
        setOnline,
        setPoper,
        type,
        setType,
        propsID,
        initialVal,
        poper,
        setPoperPop,
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
