import React, { useState } from "react";
import "../App";
import image from '../assets/chat.png';
import gallery from '../assets/gallery.png';

import app from "../Firebase";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc,getFirestore, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from "react-router-dom";
 const auth = getAuth(app);
const storage = getStorage(app);
export const db = getFirestore(app)
function SignUp() {

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [file, setFile] = useState(null); // State to store uploaded file

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res);

      // Check if file is uploaded
     
        const storageRef = ref(storage, displayName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          (error) => {
            setError(true);
            setErrorMessage(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateProfile(auth.currentUser, {
               displayName,
                photoURL: downloadURL
              });

              await setDoc(doc(db, 'users', res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                photoURL: downloadURL
              });
          //   console.log('data uploaded successfully in users')

              await setDoc(doc(db, 'userChats', res.user.uid), {})

              navigate("/Home");
            })
          }
        );
      
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      setTimeout(() =>{
        setError(false)
      },3000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };


 


  return (    
<section>
  <div class="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
    <div class="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md border p-7 rounded-2xl">
      <div class="mb-2 flex justify-center">
        
        <img src={image} className="w-20 h-20" alt="" />
      </div>
      <h2 class="text-center text-2xl font-bold leading-tight text-black">
        Sign up to create account
      </h2>
      <p class="mt-2 text-center text-base text-gray-600">
        Already have an account?{" "}
        <Link
          to= "/login"
          title=""
          class="font-medium text-black transition-all duration-200 hover:underline"
        >
          Sign In
        </Link>
      </p>
      <form onSubmit={handleSubmit} class="mt-8">
        <div class="space-y-5">
          <div>
            <label htmlFor="name" class="text-base font-medium text-gray-900">
              {" "}
              Full Name{" "}
            </label>
            <div class="mt-2">
              <input
                class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="text"
                onChange={(event)=> setDisplayName(event.target.value)}
                placeholder="Full Name"
                id="name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" class="text-base font-medium text-gray-900">
              {" "}
              Email address{" "}
            </label>
            <div class="mt-2">
              <input
                class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="email"
                value={email}
                onChange={(event)=> setEmail(event.target.value)}
                placeholder="Email"
                id="email"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label htmlFor="password" class="text-base font-medium text-gray-900">
                {" "}
                Password{" "}
              </label>
            </div>
            <div class="mt-2">
              <input
                class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="password"
                onChange={(event)=> setPassword(event.target.value)}
                placeholder="Password"
                id="password"
              />
            </div>
          </div>

          <div>
          
              <label htmlFor="type" class="flex items-center gap-2 text-base font-medium text-gray-900">
               <img src={gallery} className=" w-8 h-8 "/>
               <span>Add Profile</span>
              </label>
        
            
              <input
                className=" hidden"
                type="file"              
                id="type"
                onChange={handleFileChange}
              />
            
          </div>
                  
          <div>
            <button
              type="submit"
              class="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
            >
              Create Account{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="ml-2"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </form>
      <div class="mt-3 space-y-3">
        <button
          type="button"
          class="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
        >
          <span class="mr-2 inline-block">
            <svg
              class="h-6 w-6 text-rose-400"
              xmlns="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
            </svg>
          </span>
          Sign up with Google
        </button>
       
      </div>
      { error && <span className=" text-red-500 block font-semibold">{errorMessage}</span>}
    </div>
  </div>
</section>
 
  );
}

export default SignUp;
