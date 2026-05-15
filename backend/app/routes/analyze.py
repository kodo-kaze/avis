from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.response_schema import AnalysisResponse, TextInput
from app.utils.parser import parse_file_to_comments
from app.utils.preprocessing import preprocess_comments
from app.services.orchestrator import process_feedback

router = APIRouter()

@router.post("/upload", response_model=AnalysisResponse)
async def upload_and_analyze(file: UploadFile = File(...)):
    """
    Accepts an uploaded file (CSV, JSON, TXT), extracts comments,
    and runs them through the AI orchestration pipeline.
    """
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    # 1. Parse File
    raw_comments = parse_file_to_comments(content, file.filename)
    
    if not raw_comments:
        raise HTTPException(status_code=400, detail="No comments could be extracted from the file.")

    # 2. Clean and preprocess
    cleaned_comments = preprocess_comments(raw_comments)

    if not cleaned_comments:
        raise HTTPException(status_code=400, detail="No valid comments found after preprocessing.")

    # 3. Orchestrate AI Pipelines
    try:
        response = await process_feedback(cleaned_comments)
        return response
    except Exception as e:
        # Log the detailed error in a real app
        import traceback
        error_details = traceback.format_exc()
        print(f"Pipeline error: {error_details}")
        raise HTTPException(
            status_code=500, 
            detail=f"AI processing pipeline failed: {str(e)}"
        )

@router.post("/analyze-text", response_model=AnalysisResponse)
async def analyze_text(input_data: TextInput):
    """
    Analyzes a single block of pasted text. 
    Assumes lines or sentences are individual comments.
    """
    if not input_data.text or not input_data.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")
        
    # Split text into lines/sentences
    raw_comments = [line.strip() for line in input_data.text.split('\n') if line.strip()]
    
    cleaned_comments = preprocess_comments(raw_comments)
    
    if not cleaned_comments:
        raise HTTPException(status_code=400, detail="No valid comments found after preprocessing.")

    try:
        response = await process_feedback(cleaned_comments)
        return response
    except Exception as e:
        import traceback
        print(f"Pipeline error: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500, 
            detail=f"AI processing pipeline failed: {str(e)}"
        )

@router.get("/results/{result_id}")
async def get_results(result_id: str):
    """
    Future-ready placeholder for retrieving past analyses.
    Requires database integration.
    """
    return {"message": f"Result {result_id} retrieval not yet implemented. Waiting for PostgreSQL integration."}
