import React , {useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeInput from "./ThemeInput";
import LoadingStatus from "./LoadingStatus";
import { API_BASE_URL } from "../utils";

function StoryGenerator(){
    const navigate = useNavigate();
    const [theme,settheme] = useState("");
    const [jobid,setjobid] = useState(null);
    const [jobStatus,setjobStatus] = useState(null);
    const [error , seterror] = useState(null);
    const [loading,setloading] = useState(false);


    useEffect(()=>{
        let pollinterval ;
        if (jobid && jobStatus === "processing"){
            pollinterval = setInterval(()=>{
                pullJobStatus(jobid);
            },5000)
        }

        return () => {
            if (pollinterval){
                clearInterval(pollinterval);
            }
        }
    },[jobid,jobStatus])

    const fetchstory = async (id) => {
        try {
            setloading(false);
            setjobStatus("completed");
            navigate(`/story/${id}`);
        } catch (e) {
            seterror(`Failed to load story: ${e.message}`);
            setloading(false)
        }
    }

    const generateStory = async (theme) => {
        setloading(true);
        seterror(null);
        settheme(theme);
        
        try {
            const response = await axios.post(`${API_BASE_URL}/stories/create`,{theme})
            const {job_id:JobId , status} = response.data;
            setjobid(JobId)
            setjobStatus(status)

            pullJobStatus(JobId)
        } catch (e) {
            setloading(false);
            seterror(`failed to generate story: ${e.message}`);
        }
    }

    const reset = () => {
        setjobid(null);
        setjobStatus(null);
        seterror(null);
        setloading(false);
        settheme("");
    }

    const pullJobStatus = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
            const {status , story_id,error:Joberror} = response.data;
            setjobStatus(status)

            if (status === "completed" && story_id){
                fetchstory(story_id)
            }else if (status === "failed" || Joberror){  
                seterror(Joberror|| "Failed to generate story");
                setloading(false);
            }
        }catch (e){
            if (e.response?.status != 404){
                seterror(`failed to chech story status: ${e.message}`);
            }
        }
    }
    return <div className="story-generator">
        {error && <div className="error-message">
                <p>{error}</p>
                <button onClick={reset}>Try again</button>
            </div>}
            {!jobid && !error && !loading && <ThemeInput onSubmit={generateStory} />}
            {loading && <LoadingStatus theme={theme}/>}
    </div>

}

export default StoryGenerator;