import React, { useState } from 'react'
import Sidebar from './Sidebar'
import ChatSection from './ChatSection'
function Home() {
const[menu, setMenu] = useState(false)
  return (
    <div className="container w-full h-screen flex">
      <Sidebar menu= {menu}/>
      <ChatSection setMenu = {setMenu}></ChatSection>
    </div>
  )
}

export default Home