import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import app from "../Firebase";


export const auth = getAuth(app);


export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
  const [currentUser, setCurrentUser] = useState({})

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (user)=>{
      setCurrentUser(user)
   
    });

    return ()=>{
      unsub();
    }
  }, []);
  return (
    <AuthContext.Provider value={{currentUser}}>
      {children}
    </AuthContext.Provider>
  )

}