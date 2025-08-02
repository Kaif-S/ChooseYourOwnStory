import React from 'react'

const LoadingStatus = ({theme}) => {
  return (
    <div className='loading-container'>
        <h2>generating your {theme} story</h2>

        <div className='loading-animation'>
            <div className='spinner'></div>
        </div>
        <p className='loading-info'>please wait while we generate your story...</p>
    </div>
  )
}

export default LoadingStatus
