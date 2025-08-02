import React ,  { useState } from 'react'

const ThemeInput = ({onSubmit}) => {
    const [Theme, setTheme] = useState('');
    const [Error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!Theme.trim()){
            setError("please submit a theme")
            return
        }
        onSubmit(Theme)
    
    }
  return (
    <div>
      <div className='theme-input-container'>
        <h2>generate your adventure</h2>
        <p>theme for your interactive story</p>

        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <input type="text" 
                value={Theme} 
                onChange={(e)=>setTheme(e.target.value)} 
                placeholder='Enter a theme eg. "Space Exploration"'
                className={Error ? 'error' : ''}
                />
            </div>
            {Error && <p className='error-text'> {Error}</p>}
            <button type="submit" className='generate-btn'>Generate story</button>
        </form>
      </div>
    </div>
  )
}

export default ThemeInput
