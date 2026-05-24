from app.services.risk_model import risk_predictor
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.response_schema import AnalysisResponse, TextInput
from app.utils.parser import parse_file_to_comments
from app.utils.preprocessing import preprocess_comments
from app.services.orchestrator import process_feedback

router = APIRouter()

def append_risk_score(response_obj):
    """Helper to safely calculate and append the XGBoost risk score."""
    # We use a placeholder for sentiment here. 
    dynamic_sentiment = 0.4 
    
    churn_probability = risk_predictor.predict_risk(
        sentiment=dynamic_sentiment, 
        response_time=2, 
        frequency=5
    )
    
    # Safely convert the Pydantic object to a dictionary so we can add our new field
    if hasattr(response_obj, "model_dump"):
        resp_dict = response_obj.model_dump()
    elif hasattr(response_obj, "dict"):
        resp_dict = response_obj.dict()
    else:
        resp_dict = dict(response_obj)
        
    resp_dict["churn_risk_score"] = round(churn_probability * 100, 2)
    return resp_dict

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

    raw_comments = parse_file_to_comments(content, file.filename)
    if not raw_comments:
        raise HTTPException(status_code=400, detail="No comments could be extracted from the file.")

    cleaned_comments = preprocess_comments(raw_comments)
    if not cleaned_comments:
        raise HTTPException(status_code=400, detail="No valid comments found after preprocessing.")

    try:
        response = await process_feedback(cleaned_comments)
        return append_risk_score(response)
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Pipeline error: {error_details}")
        raise HTTPException(status_code=500, detail=f"AI processing pipeline failed: {str(e)}")

@router.post("/analyze-text", response_model=AnalysisResponse)
async def analyze_text(input_data: TextInput):
    """
    Analyzes a single block of pasted text. 
    """
    if not input_data.text or not input_data.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")
        
    raw_comments = [line.strip() for line in input_data.text.split('\n') if line.strip()]
    cleaned_comments = preprocess_comments(raw_comments)
    
    if not cleaned_comments:
        raise HTTPException(status_code=400, detail="No valid comments found after preprocessing.")

    try:
        response = await process_feedback(cleaned_comments)
        return append_risk_score(response)
    except Exception as e:
        import traceback
        print(f"Pipeline error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"AI processing pipeline failed: {str(e)}")

@router.get("/results/{result_id}")
async def get_results(result_id: str):
    return {"message": f"Result {result_id} retrieval not yet implemented."}