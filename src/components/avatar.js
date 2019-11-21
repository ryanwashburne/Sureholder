import React from 'react'
import { Link } from 'react-router-dom'

const SIZE = 40

export default ({ icon, tag, link }) => {
  return (
    <div className="flex group mb-4">
      <Link to={link}>
        <div
          style={{ width: SIZE, height: SIZE, borderRadius: '50%' }}
          className="bg-primary hover:bg-primary-dark flex justify-center items-center uppercase cursor-pointer"
        >
          {icon}
        </div>
      </Link>
      {/* <div className="group-hover:text-red-500 absolute bg-gray-900 p-1" style={{ right: -50 }}>
        {tag}
      </div> */}
    </div>
  )
}