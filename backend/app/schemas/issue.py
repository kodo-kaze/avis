from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class OpinionBase(BaseModel):
    text: str
    author: str

class OpinionCreate(OpinionBase):
    pass

class OpinionResponse(OpinionBase):
    id: int
    issue_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class IssueBase(BaseModel):
    title: str
    description: str
    author: str

class IssueCreate(IssueBase):
    pass

class IssueResponse(IssueBase):
    id: int
    status: str
    created_at: datetime
    analysis_result: Optional[Dict[str, Any]] = None
    opinions: List[OpinionResponse] = []

    class Config:
        from_attributes = True
