import React, { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

const entiers = {
  employers: null,
  fonction: null,
  ville: null,
  absence: null,
  service: null,
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
const [UserR, setUserR] = useState(null);
const [isNewSortie, setIsNewSortie] = useState(false);
const [OpenSS, setOpenSS] = useState(false);
const [AllDatas, setAllDatas] = useState(entiers);


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

  const handleAllDatas = (name,values) =>
    setAllDatas({
      ...AllDatas,
      [name]: values,
    }
  );

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      value={{
        handleAllDatas,
        AllDatas,
        setOpenSS,
        OpenSS,
        isNewSortie,
        setIsNewSortie,
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
        setPropsID,
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
