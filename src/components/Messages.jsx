import React, { useContext, useEffect, useRef } from 'react'
import '../App.css'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
function Messages({message}) {
 
 const {currentUser} = useContext(AuthContext);
 const {data} = useContext(ChatContext);
 const ref = useRef();
 useEffect(()=>{
  ref.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  })
 }, [message])

  return (
    <>
    <div ref={ref} className={`${message.senderId === currentUser.uid && 'received'} mb-3 flex items-center gap-4  w-full`}>
     <div className=' w-[60px]'>
     <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} className=' w-[50px] h-[50px] rounded-full' alt="" />
     <span className=' text-sm text-nowrap text-gray-400 font-medium'>Just now</span>
     </div>
      
      <div className='md:w-1/2 w-full '>
      <p className=' w-fit bg-white px-4 rounded-s-sm rounded-tr-lg rounded-br-sm py-2 text-justify'>{message.text}</p>
      </div>
    </div>

    {/* <div className=' mb-3 flex items-center gap-4  w-full'>
     <div className=' w-[60px]'>
     <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" className=' w-[50px] h-[50px] rounded-full' alt="" />
     <span className=' text-sm text-nowrap text-gray-400 font-medium'>Just now</span>
     </div>
      
      <div className=' md:w-1/2 w-full'>
      <p className=' w-fit bg-white px-4 rounded-s-sm rounded-tr-lg rounded-br-sm py-2 text-justify'>Lorem ipsuptatee fium dicta Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, distinctio..</p>
      </div>
    </div> */}
    </>
  )
}

export default Messages