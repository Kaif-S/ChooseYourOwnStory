import React , { useState , useEffect } from "react";

function StoryGame({story,onNewStory}){
    const [currentNodeid,setcurrentNodeid] = useState(null);
    const [currentNode, setcurrentNode] = useState(null);
    const [options,setoptions] = useState([]);
    const [isEnding, setIsEnding] = useState(false);
    const [iswinningEnding,setiswinnigEnding] = useState(false);

    useEffect(()=>{
        if(story && story.root_node){ 
            setcurrentNodeid(story.root_node.id);

        }
    },[])

    useEffect(() => {
        if (currentNodeid && story && story.all_node){
            const node = story.all_node[currentNodeid]
            setcurrentNode(node)
            setIsEnding(node.is_ending)
            setiswinnigEnding(node.is_winning_ending)

            if (!node.is_ending && node.options && node.options.length > 0){
                setoptions(node.options)
            }
            else{
                setoptions([])
            }
        }
      
    }, [currentNodeid,story])

    function chooseOption(optionId){
        setcurrentNodeid(optionId)
    }

    function restartStory(){
        if(story && story.root_node){
            setcurrentNodeid(story.root_node.id)
        }
    }

    return <div className="story-game">
        <header className="story-header">
            <h2>{story.title}</h2>
        </header>
        <div className="story-content">
            {currentNode && <div className="story-node">
                <p>{currentNode.content}</p>
                {isEnding?<div className="story-ending">
                    <h3>{iswinningEnding?"Congratulations":"The End"}</h3>
                    {iswinningEnding?"You have reached an winning ending":"Your adventure has ended"}
                </div>
                :
                <div className="story-options">
                    <h3>What will you do?</h3>
                    <div className="options-list">
                        {options.map((option,index)=>{
                            return <button key={index} 
                            onClick={()=>chooseOption(option.node_id)} 
                            className="option-btn">
                                {option.text}
                            </button>
                        })}
                    </div>
                </div>}
                </div>}
                <div className="story-controls">
                        <button onClick={restartStory} className="reset-btn">Restart Story</button>
                </div>
                {onNewStory && <button className="new-story-btn" onClick={onNewStory}>New story</button>}
        </div>
        </div>

}

export default StoryGame