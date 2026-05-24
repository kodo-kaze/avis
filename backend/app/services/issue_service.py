from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.issue import Issue
from app.models.opinion import Opinion
from app.config.redis import cache
from app.schemas.issue import IssueCreate, OpinionCreate, IssueResponse
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
        
        # Active Invalidation: Clear public cache since a new issue was added
        cache.invalidate("issues:public:all")
        return db_issue

    @staticmethod
    def get_issues(db: Session) -> List[Issue]:
        cache_key = "issues:public:all"
        
        # 1. Cache-Hit Step: Try serving from Redis first
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data

        # 2. Cache-Miss Step: Fetch from DB on miss or Redis failure
        issues = db.query(Issue).filter(Issue.is_private == False).order_by(Issue.created_at.desc()).all()
        
        # Serialize SQLAlchemy objects using Pydantic for cache storage
        serialized_issues = [IssueResponse.model_validate(i).model_dump(mode='json') for i in issues]
        
        # 3. Expiration Safety Net: Store in Redis for 1 hour
        cache.set(cache_key, serialized_issues, ttl=3600)
        
        return issues

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
        
        # Active Invalidation: Opinions change the 'analysis_result' or opinion list
        cache.invalidate("issues:public:all")
        
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
        # Active Invalidation
        cache.invalidate("issues:public:all")

    @staticmethod
    def resolve_issue(issue_id: int, db: Session) -> Issue:
        db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
        if not db_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        db_issue.status = "Resolved"
        db.commit()
        db.refresh(db_issue)
        # Active Invalidation
        cache.invalidate("issues:public:all")
        return db_issue

    @staticmethod
    def reopen_issue(issue_id: int, db: Session) -> Issue:
        db_issue = db.query(Issue).filter(Issue.id == issue_id).first()
        if not db_issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        db_issue.status = "Open"
        db.commit()
        db.refresh(db_issue)
        # Active Invalidation
        cache.invalidate("issues:public:all")
        return db_issue
