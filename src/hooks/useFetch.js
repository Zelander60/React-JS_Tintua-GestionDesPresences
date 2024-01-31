import { useState, useEffect } from "react";
// import API from "../constants/Api";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateContext } from "../contexts/ContextProvider";


const useFetch = (endpoint, method, query) => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ok, setOK] = useState(false);
    const [error, setError] = useState(null);

    // const if_contain = (text) => {
    //     text.
    // }
    const { API } = useStateContext();

    const fetchData = async () => 
      {  
        const id = toast.loading('En cours ...',{isLoading: true})
        setIsLoading(true);
        // console.info(query)
    await fetch(`${API.Local_Host_Name}/api/${endpoint}`, {
            method: method,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(query),
          })
          .then(response => {
            if (!response.ok) {
              // handle network errors or non-2xx status codes
              toast.error('Vérifiez votre connexion !');
            }
            return response.json();
          })
            .then((responseJson) => {
              //Showing response message coming from server
              if (responseJson?.status !== 200) {
                toast.warn(`${responseJson?.message} ${responseJson?.errors}`);
                setIsLoading(false);
                console.warn(`${responseJson}`);
                // console.log("iiiiiiiiii")
                
              } else{
                // setIsLoading(false);
                setData(responseJson);
                endpoint !== 'employers' ? toast.success(`${responseJson?.message}`) : '';
                // toast.warn(`${responseJson?.message} ${responseJson?.errors}`);
                setOK(true);
                console.log(responseJson)
              }
            })
            .catch(errors => {
              //display error message         
              toast.error("Une erreure est survenue !");
              console.warn(errors);
              setError(errors);
            })
            .finally(()=>{
              toast.dismiss(id);
              setIsLoading(false);
            });
    }

    // const fetchData1 = async ()=> await toast.promise(
    //   fetchData2,
    //   {
    //     pending: 'En cours ...',
    //     success: 'Terminée !',
    //     error: 'Erreur !'
    //   }
    // )

    useEffect(() => {
      fetchData();
    }, [])

    const refetch = () => {
        setIsLoading(true);
        fetchData();
        return true
    }

    const Fragment = ()=> (
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" />
    )

    return { data, isLoading, error, ok, refetch , Fragment};
    
}

export default useFetch;