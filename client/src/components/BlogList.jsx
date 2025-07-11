import React, { useState } from 'react'
import { blogCategories } from '../assets/assets'

const BlogList = () => {

    const [menu, setMenu] = useState("All")

  return (
    <div>
      <div className='flex justify-center gap-4 sm:gap-8 my-10'>
        {blogCategories.map((item) => (
          <div key={item} className='relative'>
            {menu === item && (
              <div className='absolute inset-0 bg-primary rounded-full -z-10'></div> 
            )}
            <button
              onClick={() => setMenu(item)}
              className={`relative z-10 px-4 py-1 rounded-full transition duration-200 ${
                menu === item ? 'text-white' : 'text-gray-500'
              }`}
            >
              {item}
            </button>
          </div>
        ))}
      </div>
      <div>
        {/* --- blog cards --- */}
      </div>
    </div>
  )
}

export default BlogList
