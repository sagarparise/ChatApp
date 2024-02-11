import React, { useState, useEffect, useContext } from "react";
import { FaVideo, FaUser } from "react-icons/fa";
import { MdFilePresent } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
import Messages from "./Messages";
import { IoMenu } from "react-icons/io5";
import '../App.css'
import app from '../Firebase';
import { getStorage, uploadBytesResumable,ref, getDownloadURL } from "firebase/storage"; 
import { getFirestore , doc, onSnapshot, updateDoc, arrayUnion, Timestamp, serverTimestamp} from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { v4 as uuid } from 'uuid';
const db = getFirestore(app);
const storage = getStorage(app);

function ChatSection({setMenu}) {

const [text, setText] = useState("");
const [image, setImage] = useState(null)
const {currentUser} = useContext(AuthContext)
const [messages, setMessages] = useState([]);
  const { data} = useContext(ChatContext);

  useEffect(()=>{
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      console.log(data.chatId)
           doc.exists() && setMessages(doc.data().messages)
          });
          return () => {
            unsub();
          };
  }, [data])

  
const handleSend = async()=>{
  
  if(image){
    const storageRef = ref(storage, uuid());
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      (error) => {
       
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", data.chatId),{
            messages: arrayUnion({
              id: uuid(),
              text: text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            })
          })
        })
      }
    );
    setText("")
    setImage(null)

  }
  else
  {
    await updateDoc(doc(db, "chats", data.chatId),{
      messages: arrayUnion({
        id: uuid(),
        text: text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      })
    })
  }

  // await updateDoc(doc(db, "userChats", currentUser.uid),{
  //   [data.chatId]:{
  //     userInfo: {
  //       lastMessage: text,
  //     },
    
  //     date: serverTimestamp(),
  //   }
  //     });

  //     await updateDoc(doc(db, "userChats", data.user.uid),{
  //       [data.chatId]:{
  //         userInfo: {
  //           lastMessage: text,
  //         },
  //         date: serverTimestamp(),
  //       },})

         

  setText("")
  setImage(null)
}
   
 
  return (
    <div className=" w-screen h-screen">
      <div className=" h-[60px] bg-black relative text-white flex justify-between items-center px-7 py-4">
      <IoMenu className=" text-3xl sm:hidden block hover:bg-white hover:text-black" onClick={()=>setMenu((prevValue) => !prevValue)} />
        <h2 className=" text-xl font-serif ">{data.user?.displayName}</h2>
        <div className="flex items-center gap-7 text-2xl">
          <FaVideo />
          <FaUser />
        </div>
      </div>
      
      <div className=" chat-sec bg-[#e2ddcf] p-5">
        {messages.map((msg) =>(

        <Messages key={msg.id} message={msg} />

        ))}
        {/* <Messages/>
        <Messages/>
        <Messages/> */}
      </div>

      <div className=" h-[60px] bg-[#efecec91] flex items-center gap-3 px-5 py-2">
        <input
          className=" h-10 w-full  rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          type="email"
          placeholder="Text..."
          value={text}
          onChange={e=> setText(e.target.value)}
          
        />
        <input type="file" id='image'className='hidden' onChange={e=> setImage(e.target.files[0])} />
      <label htmlFor="image"><BiImageAdd className=" text-2xl text-gray-500" /></label>
        <input type="file" id="doc" className='hidden'  />
        <label htmlFor="doc"><MdFilePresent className='w-6 text-2xl text-gray-500' /></label>
      <button
      onClick={ handleSend}
      class="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      Send
    </button>
      </div>
    </div>
  );
}

export default ChatSection;
