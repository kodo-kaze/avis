from sqlalchemy import Column, Integer, String, DateTime, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.config.database import Base
import enum

class IssueStatus(str, enum.Enum):
    OPEN = "Open"
    RESOLVED = "Resolved"
    PENDING = "Pending"

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default="Open")
    author = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    analysis_result = Column(JSON, nullable=True)

    opinions = relationship("Opinion", back_populates="issue", cascade="all, delete-orphan")
