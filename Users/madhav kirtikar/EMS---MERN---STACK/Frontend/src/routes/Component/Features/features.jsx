 import React from 'react'
import image_1 from '../../assets/image_1.png'
import image_2 from '../../assets/performance_track.jpg'
import image_3 from '../../assets/Data.jpg'

const Features = () => {
  return (
    <div className="my-20 mx-auto w-[90%] flex items-center justify-between">
      <div className="relative basis-[31%] group">
        <img src={image_1} alt="" className="w-full rounded-[10px] block" />
        <div className="rounded-[10px] absolute inset-0 bg-[rgba(0,15,152,0.3)] flex flex-col items-center justify-center text-white cursor-pointer opacity-0 pt-[70%] transition-all duration-400 group-hover:opacity-100 group-hover:pt-0">
          <p>Smart Employee Onboarding</p>
        </div>
      </div>
      <div className="relative basis-[31%] group">
        <img src={image_2} alt="" className="w-full rounded-[10px] block" />
        <div className="rounded-[10px] absolute inset-0 bg-[rgba(0,15,152,0.3)] flex flex-col items-center justify-center text-white cursor-pointer opacity-0 pt-[70%] transition-all duration-400 group-hover:opacity-100 group-hover:pt-0">
          <p>Track Employee Perfornmance</p>
        </div>
      </div>
      <div className="relative basis-[31%] group">
        <img src={image_3} alt="" className="w-full rounded-[10px] block" />
        <div className="rounded-[10px] absolute inset-0 bg-[rgba(0,15,152,0.3)] flex flex-col items-center justify-center text-white cursor-pointer opacity-0 pt-[70%] transition-all duration-400 group-hover:opacity-100 group-hover:pt-0">
          <p>Data Security</p>
        </div>
      </div>
    </div>
  )
}

export default Features