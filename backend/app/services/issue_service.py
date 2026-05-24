from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.issue import Issue
from app.models.opinion import Opinion
from app.schemas.issue import IssueCreate, OpinionCreate
from app.services.orchestrator import process_feedback
from app.utils.preprocessing import preprocess_comments
from typing import List

async def trigger_ai_analysis(issue_id: int, db: Session):
    """Gathers opinions and triggers the AI pipeline for an issue."""
    db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not db_issue:
        return
        
    all_opinions = db.query(Opinion).filter(Opinion.issue_id == issue_id).all()
    texts = [o.text for o in all_opinions]
    
    cleaned_comments = preprocess_comments(texts)
    if cleaned_comments:
        try:
            # We import here to avoid circular dependency if any
            from app.routes.analyze import append_risk_score
            
            analysis_response = await process_feedback(cleaned_comments)
            final_result = append_risk_score(analysis_response)
            
            db_issue.analysis_result = final_result
            db.commit()
        except Exception as e:
            print(f"Automated pipeline failed for issue {issue_id}: {str(e)}")

class IssueService:
    @staticmethod
    def create_issue(issue: IssueCreate, db: Session) -> Issue:
        db_issue = Issue(
            title=issue.title,
            description=issue.description,
            author=issue.author,
            is_private=issue.is_private
        )
        db.add(db_issue)
        db.commit()
        db.refresh(db_issue)
        return db_issue

    @staticmethod
    def get_issues(db: Session) -> List[Issue]:
        return db.query(Issue).filter(Issue.is_private == False).order_by(Issue.created_at.desc()).all()

    @staticmethod
    def get_issue(issue_id: int, db: Session) -> Issue:
        db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
        if not db_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        return db_issue

    @staticmethod
    def get_my_issues(author: str, db: Session) -> List[Issue]:
        return db.query(Issue).filter(Issue.author == author).order_by(Issue.created_at.desc()).all()

    @staticmethod
    async def add_opinion(issue_id: int, opinion: OpinionCreate, db: Session) -> Opinion:
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
        
        # Check threshold (3)
        opinions_count = db.query(Opinion).filter(Opinion.issue_id == issue_id).count()
        if opinions_count >= 3:
            # Trigger analysis asynchronously (simulated)
            await trigger_ai_analysis(issue_id, db)
            
        return db_opinion

    @staticmethod
    def delete_issue(issue_id: int, db: Session):
        db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
        if not db_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        db.delete(db_issue)
        db.commit()

    @staticmethod
    def resolve_issue(issue_id: int, db: Session) -> Issue:
        db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
        if not db_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        db_issue.status = "Resolved"
        db.commit()
        db.refresh(db_issue)
        return db_issue

    @staticmethod
    def reopen_issue(issue_id: int, db: Session) -> Issue:
        db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
        if not db_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        db_issue.status = "Open"
        db.commit()
        db.refresh(db_issue)
        return db_issue
