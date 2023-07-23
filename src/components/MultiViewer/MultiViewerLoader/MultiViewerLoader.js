import React from 'react'
import Spinner from 'src/components/Spinner'
import './MultiViewerLoader.scss'

const MultiViewerLoader = () => {
  return (
    <div className='MultiViewerLoader'>
          <Spinner height='50px' width='50px'/>
    </div>
  )
}

export default MultiViewerLoader