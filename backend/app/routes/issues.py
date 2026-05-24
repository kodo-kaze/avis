from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.models.issue import Issue
from app.models.opinion import Opinion
from app.schemas.issue import IssueCreate, IssueResponse, OpinionCreate, OpinionResponse
from app.services.orchestrator import process_feedback
from app.routes.analyze import append_risk_score
from app.utils.preprocessing import preprocess_comments

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
    # Simple list view, usually we'd exclude opinions/analysis here for speed
    return db.query(Issue).order_by(Issue.created_at.desc()).all()

@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue(issue_id: int, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return db_issue

@router.get("/me/{author}", response_model=List[IssueResponse])
def get_my_issues(author: str, db: Session = Depends(get_db)):
    return db.query(Issue).filter(Issue.author == author).order_by(Issue.created_at.desc()).all()

@router.post("/{issue_id}/opinions", response_model=OpinionResponse)
async def create_opinion(issue_id: int, opinion: OpinionCreate, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db_opinion = Opinion(
        issue_id=issue_id,
        text=opinion.text,
        author=opinion.author
    )
    db.add(db_opinion)
    db.commit()
    db.refresh(db_opinion)
    
    # Check if we should trigger analysis (threshold 3)
    opinions_count = db.query(Opinion).filter(Opinion.issue_id == issue_id).count()
    
    # Recalculate if threshold met (>= 3)
    if opinions_count >= 3:
        try:
            # Gather all opinions
            all_opinions = db.query(Opinion).filter(Opinion.issue_id == issue_id).all()
            texts = [o.text for o in all_opinions]
            
            cleaned_comments = preprocess_comments(texts)
            if cleaned_comments:
                analysis_response = await process_feedback(cleaned_comments)
                final_result = append_risk_score(analysis_response)
                
                # Save/Update analysis result
                db_issue.analysis_result = final_result
                db.commit()
        except Exception as e:
            print(f"Automated pipeline failed for issue {issue_id}: {str(e)}")
    
    return db_opinion

@router.delete("/{issue_id}")
def delete_issue(issue_id: int, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db.delete(db_issue)
    db.commit()
    return {"detail": "Issue deleted successfully"}

@router.patch("/{issue_id}/resolve", response_model=IssueResponse)
def resolve_issue(issue_id: int, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db_issue.status = "Resolved"
    db.commit()
    db.refresh(db_issue)
    return db_issue

@router.patch("/{issue_id}/reopen", response_model=IssueResponse)
def reopen_issue(issue_id: int, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db_issue.status = "Open"
    db.commit()
    db.refresh(db_issue)
    return db_issue
