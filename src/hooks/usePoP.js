import { useState, useEffect } from "react";

const usePoP = (action) => {

    const [oui, setOui] = useState(false);

    // const if_contain = (text) => {
    //     text.

    const referer = (val) => {
        setOui(val)
    }


    return { oui, referer };
    
}

export default usePoP;