import React , { useState , useEffect } from 'react'
import { useParams , useNavigate} from 'react-router-dom';
import axios from 'axios';
import LoadingStatus from './LoadingStatus';
import StoryGame from './StoryGame';
import { API_BASE_URL } from '../utils';

const StoryLoader = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [Story,setStory] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [Error, setError] = useState(null)

    useEffect(()=>{
        loadstory(id)
    },[id])

    const loadstory = async (storyid) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/stories/${storyid}/complete`);
            setStory(response.data);
            setLoading(false);
        }
        catch (err){
            if (err.response?.status === 404){
                setError("Story not found");
            } else{
                setError("Failed to load story");
            }
        }finally{
            setLoading(false);
        }
    }
    const createNewStory = () =>{
        navigate("/");
    }

    if (Loading){
        return <LoadingStatus theme={"Story"}/>
    }

    if (Error){
        return <div className='story-loader'>
            <div className='error-message'>
                <h2>story not found </h2>
                <p>{Error}</p>
                <button onClick={createNewStory}>Go to Story generator</button>
            </div>
        </div>
    }
    if (Story){
        return <div className='story-loader'>
            <StoryGame story={Story} onNewStory={createNewStory} />
        </div>
    }
  
}

export default StoryLoader
