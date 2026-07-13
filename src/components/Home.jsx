import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>Welcome to mail client
        <button onClick={()=>{navigate("/compose")}}>Compose</button>
    </div>
  )
}

export default Home