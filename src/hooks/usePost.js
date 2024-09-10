import { useState, useEffect } from "react";
// import API from "../constants/Api";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetch from "./useFetch";
import { useStateContext } from "../contexts/ContextProvider";


const usePost = (refresh,type) => {

    // const {refresh} = props;

    // const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ok, setOK] = useState(false);
    const [error, setError] = useState(null);

    const { API, setUserR } = useStateContext();

    // const if_contain = (text) => {
    //     text.
    // }

    const fetchData = async (endpoint, method, query) => 
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
                setIsLoading(false);
                let tt = responseJson?.errors?.ordre ? "Le numéro d'ordre est déja utilisé par un autre utilisateur" : 'Une erreur est survenue , réessayer .'
                console.warn(`${tt} ${responseJson}`);
                toast.warn(`${tt}`);
                // console.log("iiiiiiiiii")
                
              } else{
                setIsLoading(false);
                // setData(responseJson);
                endpoint !== 'employers' ? toast.success(`${responseJson?.message}`) : '';
                let tOrdre = query?.ordre ? query?.ordre : '1'; 
                type == 'add' ? localStorage.setItem('Tordre', tOrdre) : '';
                // toast.warn(`${responseJson?.message} ${responseJson?.errors}`);
                (type != null) && refresh();
                (type == null) && setUserR(responseJson?.user[0] ?? null);
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

    const refetchPost = (endpoint, method, query) => {
        fetchData(endpoint, method, query);
        // return true
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

    return { isLoading, error, refetchPost , Fragment};
    
}

export default usePost;