from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.schemas.issue import IssueCreate, IssueResponse, OpinionCreate, OpinionResponse
from app.services.issue_service import IssueService

router = APIRouter(prefix="/issues", tags=["Issues"])

@router.post("/", response_model=IssueResponse)
def create_issue(issue: IssueCreate, db: Session = Depends(get_db)):
    return IssueService.create_issue(issue, db)

@router.get("/", response_model=List[IssueResponse])
def get_issues(db: Session = Depends(get_db)):
    return IssueService.get_issues(db)

@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue(issue_id: int, db: Session = Depends(get_db)):
    return IssueService.get_issue(issue_id, db)

@router.get("/me/{author}", response_model=List[IssueResponse])
def get_my_issues(author: str, db: Session = Depends(get_db)):
    return IssueService.get_my_issues(author, db)

@router.post("/{issue_id}/opinions", response_model=OpinionResponse)
async def create_opinion(issue_id: int, opinion: OpinionCreate, db: Session = Depends(get_db)):
    return await IssueService.add_opinion(issue_id, opinion, db)

@router.delete("/{issue_id}")
def delete_issue(issue_id: int, db: Session = Depends(get_db)):
    IssueService.delete_issue(issue_id, db)
    return {"detail": "Issue deleted successfully"}

@router.patch("/{issue_id}/resolve", response_model=IssueResponse)
def resolve_issue(issue_id: int, db: Session = Depends(get_db)):
    return IssueService.resolve_issue(issue_id, db)

@router.patch("/{issue_id}/reopen", response_model=IssueResponse)
def reopen_issue(issue_id: int, db: Session = Depends(get_db)):
    return IssueService.reopen_issue(issue_id, db)
