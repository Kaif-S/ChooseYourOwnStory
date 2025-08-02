from sqlalchemy.orm import Session
import json
from core.config import settings

from .prompts import STORY_PROMPT
from models.story import Story, StoryNode
from core.models import StoryNodeLLM

from google import genai
client = genai.Client(api_key=settings.GEMINI_API_KEY)

class StoryGenerator:

    @classmethod
    def generate_story(cls,db:Session,session_id:str, theme:str = "fantasy"):
        response = client.models.generate_content(model="gemini-2.5-flash",contents=f"{STORY_PROMPT} generate story with this theme: {theme}",config={"response_mime_type" : "application/json" })
        text_response = response.candidates[0].content.parts[0].text
        story_json = json.loads(text_response)
        if story_json['title']:
            story_db = Story(title=story_json["title"],session_id=session_id)
            db.add(story_db)
            db.flush()

            root_node_data = story_json["rootNode"]
            if isinstance(root_node_data, dict):
                root_node_data = StoryNodeLLM.model_validate(root_node_data)

            #TODO process data
            cls._process_story_node(db=db, story_id=story_db.id, node_data=root_node_data, is_root=True)

            db.commit()
            return story_db

        else:
            return 404
    
    @classmethod
    def _process_story_node(cls,db:Session,story_id:int, node_data:StoryNodeLLM, is_root:bool = False) -> StoryNode:
        node = StoryNode(
            story_id = story_id,
            content = node_data.content if hasattr(node_data,'content')else node_data["content"],
            is_root = is_root,
            is_ending = node_data.isEnding if hasattr(node_data,'isEnding') else node_data["isEnding"],
            is_winning_ending = node_data.isWinningEnding if hasattr(node_data,'isWinningEnding') else node_data["isWinningEnding"],
            options=[]
        )

        db.add(node)
        db.flush()

        if not node.is_ending and hasattr(node_data,"options") and node_data.options:
            options_list = []
            for option_data in node_data.options:
                next_node = option_data.nextNode

                if isinstance(next_node, dict):
                    next_node = StoryNodeLLM.model_validate(next_node)

                child_node = cls._process_story_node(db=db,story_id=story_id,node_data=next_node,is_root=False)

                options_list.append({
                    "text":option_data.text,
                    "node_id":child_node.id
                })
            node.options = options_list
        
        db.flush()
        return node