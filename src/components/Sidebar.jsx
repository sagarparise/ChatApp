import React, { useContext, useState, useEffect } from 'react'
import chatImg from '../assets/chat.png'
import { MdLogout } from "react-icons/md";
import '../App.css'
import { signOut } from 'firebase/auth';
import { AuthContext, auth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import app from '../Firebase';
import { getFirestore,collection, query, where, setDoc, getDocs,getDoc, updateDoc, doc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { ChatContext } from '../context/ChatContext';

 const db = getFirestore(app);

function Sidebar({menu}) {
  
 const navigate = useNavigate()
 const {currentUser} = useContext(AuthContext);
 const {dispatch} = useContext(ChatContext);

 const[username, setUserName] = useState('');
 const[user, setUser] = useState(null);
 const[err, setError] = useState(false)
 const [chats, setChats] = useState([]);

 useEffect(() => {
  if (currentUser && currentUser.uid) {
   // console.log(currentUser)
    const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      setChats(doc.data())
    });
    return () => {
      unsub();
    };
  }
}, [currentUser]);


   

 const handleSearch =async ()=>{

  const q = query(collection(db, "users"), where("displayName", "==" ,username))

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setError(true); // Set error if no documents are found
      setUser(null);
    } else {
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
      setError(false); // Clear error if documents are found
    }
  } catch (err) {
    setError(true);
    setUser(null);
    console.log('error:', err);
  }

  
 }

 const handleKey = (e)=>{
    if(e.key === 'Enter')
   {
    console.log('correct key')
    handleSearch()
   }

 }

 const handleSelect = async () => {
 
console.log(currentUser)

  // Check whether the chat exists; if not, create it
   const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
  
  try {
    const res = await getDoc(doc(db, "chats", combinedId));

    if (!res.exists()) {
      // Create a chat in the chats collection
      await setDoc(doc(db, "chats", combinedId), {
        messages: []
      });
    }

    // Update userChat for the current user
    const currentUserChatRef = doc(db, 'userChats', currentUser.uid);
    await updateDoc(currentUserChatRef, {
      [combinedId]: {
        userInfo: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        date: serverTimestamp()
      }
    });

    // Update userChat for the selected user
    const selectedUserChatRef = doc(db, 'userChats', user.uid);
    await updateDoc(selectedUserChatRef, {
      [combinedId]: {
        userInfo: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          lastMessage: ''
        },
        date: serverTimestamp()
      }
    });

     setUser(null)
     setUserName('')
    // console.log("Firestore updated successfully");
  } catch (err) {
    console.error("Error updating Firestore:", err);
  }
};

const handleChating = (user) => {
  dispatch({type: 'CHANGE_USER' , payload: user});
}


 // Update the timestamp field with the value from the server
 

  return (
    <section className={`flex h-screen w-[350px] md:w-100 sm:block ${ menu ? 'block': 'hidden'}  flex-col overflow-y-auto  bg-[#353535]`}>
    <div className='h-[60px] flex items-center gap-3 relative px-4 py-1' >
      <img src={currentUser.photoURL} className=' w-10 h-10' alt="" />
      <h1 class="text-lg font-bold text-white uppercase">Chat App</h1>
      <button className='border rounded-sm p-1 log-icon text-white ml-2 font-extrabold ' ><MdLogout onClick={()=> {
        signOut(auth);
        navigate('/login')
      }} /></button>
      <span className=' text-[10px] font-medium text-white absolute bottom-[-10px] right-3 hidden'>Logout</span>
    </div>
     <hr className='mb-1 rounded-full border-gray-600' /> 
    <div class="mt-3 flex flex-1 flex-col justify-between px-6">
      <nav class="-mx-3 space-y-6 ">
        <div class="space-y-3 ">
          
        <div>
        <input
          className=" h-10 w-full text-white rounded-md border-b border-white border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-white focus:outline-none  disabled:opacity-50"
          type="text"
          value={username}
          placeholder="Find Users..."
          onKeyDown={handleKey}
          onChange={e=> setUserName(e.target.value)}
        />

          {
            err && <span>User not Found</span>
          }

          { user && <div class="flex gap-3 transform items-center hover:rounded-lg px-3 py-2 border-b text-gray-200 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-700" onClick={handleSelect} >
           <img src={user.photoURL} className=' w-10 h-10 border p-1 rounded-full' alt="" />
           <div className='flex flex-col'>
           <h3 className=' text-[18px] font-bold'>{user.displayName}</h3>
          
           </div>
          </div>
          
          }
        </div>
        

          {chats && Object.entries(chats).map((chat)=>(

            <div class="flex gap-3 transform items-center hover:rounded-lg px-3 py-2 border-b text-gray-200 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-700" key={chat[0]} onClick={()=> handleChating(chat[1].userInfo) } >
            <img src={chat[1].userInfo.photoURL} className=' w-10 h-10 border p-1 rounded-full' alt="" />
            <div className='flex flex-col'>
            <h3 className=' text-[18px] font-bold'>{chat[1].userInfo.displayName}</h3>
           
            </div>
           </div>
          ))}
          
        </div>
        
        
      </nav>
    </div>
  </section>
  )
}

export default Sidebar