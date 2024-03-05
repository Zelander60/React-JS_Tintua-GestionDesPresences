import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../data/tintua_trans.png'
// import API from '../constants/Api';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';


const ConnexionEmp = () => {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const goTo = useNavigate();
  
  const {currentColor, setPropsID, setOnline, API, setUserR } = useStateContext()

  const Connecter = async () => {
      const id = toast.loading('En cours ...',{isLoading: true})
            // setIsLoading(true);
            console.info(API)
        await fetch(`${API.Local_Host_Name}/api/tintua`, {
          // await fetch('http://localhost:8000/api/user', {
          // await fetch('http://tintua.000webhostapp.com/api/user', {
            // credentials: "omit",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'ordre': user,
              'password': password,
            }),

            // referrer: "http://localhost:3000/",
            method: "POST",
            mode: "cors",
                // mode: 'same-origin', // no-cors, cors, *same-origin
                // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: 'same-origin',
                // proxy: "http://localhost:3000",

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
                    toast.warn(`${responseJson?.message}`);
                    // setIsLoading(false);
                    console.warn(`${responseJson}`);
                    // setData(responseJson);
                    // console.log(new Date())
                    
                  } else{
                    setOnline(true);
                    goTo("/presences");
                    toast.success(`${responseJson?.message}`);
                    console.log(`${responseJson?.user[0]?.n1} i ${responseJson?.user[0]}`)
                    setUserR(responseJson?.user[0] ?? null);
                    setPropsID(responseJson?.user[0]?.id ?? 0);
                  }
                })
                .catch(errors => {
                  //display error message         
                  toast.error("Une erreure est survenue !");
                  console.warn(errors);
                  // setError(errors);
                })
                .finally(()=>{
                  toast.dismiss(id);
                  // setIsLoading(false);
                });
    }

    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className="conZ absolute left-0 top-0 bottom-0 min-h-full w-full bg-white">
        <div className="flex -mt-5 min-h-full items-center flex-col justify-center mb-16 px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src={logo}
              alt="Your Company"
            />
            <h2 className="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              BIENVENUE
            </h2>
          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" method="">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  N° d'ordre
                </label>
                <div className="mt-2">
                  <input
                    id="user"
                    name="user"
                    type="text"
                    autoComplete="name"
                    required
                    value={user}
                    onChange={(e)=> setUser(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Mot de passe
                  </label>
                  <div className="text-sm">
                    {/* <a href="/acceuil" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Oubliémm?
                    </a> */}
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="button"
                  onClick={()=>Connecter()}
                  style={{ background: currentColor,}}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Se Connecter
                </button>
              </div>
            </form>
          </div>
        </div>

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

      </div>
      </>
    )
  }
  

  export default ConnexionEmp;