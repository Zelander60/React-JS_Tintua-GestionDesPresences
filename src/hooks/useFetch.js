import { useState, useEffect } from "react";
import API from "../constants/Api";

const useFetch = (endpoint, method, query) => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ok, setOK] = useState(false);
    const [error, setError] = useState(null);

    // const if_contain = (text) => {
    //     text.
    // }

    const fetchData = async () => {
        setIsLoading(true);
    //   console.info(query)
        fetch(`${API.Local_Host_Name}/presence/${endpoint}`, {
            method: method,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(query),
          })
            .then(response => response.json())
            .then((responseJson) => {
              //Showing response message coming from server
              if (responseJson == "erreure" || responseJson.includes('erreure')) {
                setIsLoading(false);
                console.error("Erreur de connexion php !");
              } else{
                setIsLoading(false);
                setData(responseJson);
                
                setOK(true);
                console.log(responseJson)
              }
            })
            .catch(error => {
              //display error message
              setError(error);
              console.log("Erreur de connexion catch");
              console.warn(error);
            })
            .finally(()=>{
                setIsLoading(false);
            });
    }

    useEffect(() => {
      fetchData();
    }, [])

    const refetch = () => {
        setIsLoading(true);
        fetchData();
        return true
    }

    return { data, isLoading, error, ok, refetch };
    
}

export default useFetch;