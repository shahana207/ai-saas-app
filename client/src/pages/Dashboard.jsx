import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets'

const Dashboard = () => {

const [creations, setCreations] = useState([])

const getDashboardData = async ()=>{
    setCreations(dummyCreationData)
}

useEffect(()=>{
    getDashboardData()
},[])

  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>
{/*Total Creation Cards*/}
      </div>
    </div>
  )
}

export default Dashboard
