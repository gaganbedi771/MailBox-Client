import React from 'react'
import "./ComposeHeader.css"
import { useNavigate } from 'react-router-dom'

const ComposeHeader = () => {
  const navigate=useNavigate();
  return (
    <header className='text-end m-2 'onClick={()=>{navigate(-1)}}> <span className="close-btn">✕</span></header>
  )
}

export default ComposeHeader