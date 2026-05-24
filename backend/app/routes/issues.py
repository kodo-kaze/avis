from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueResponse

router = APIRouter(prefix="/issues", tags=["Issues"])

@router.post("/", response_model=IssueResponse)
def create_issue(issue: IssueCreate, db: Session = Depends(get_db)):
    db_issue = Issue(
        title=issue.title,
        description=issue.description,
        author=issue.author
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

@router.get("/", response_model=List[IssueResponse])
def get_issues(db: Session = Depends(get_db)):
    return db.query(Issue).order_by(Issue.created_at.desc()).all()
