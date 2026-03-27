from fastapi import APIRouter, HTTPException

from app.schemas.model import MalariaResponse, MalariaSymptomInput
from app.services.chat_service import generate_medical_consultation
from app.services.malaria_service import predict_malaria

router = APIRouter()


@router.post("/malaria/check", response_model=MalariaResponse)
async def check_malaria(data: MalariaSymptomInput):
    try:
        # Run the Random Forest prediction first, then compose LLM context.
        result, confidence = predict_malaria(data.model_dump())
        context = f"Malaria Test Result: {result} based on symptoms: {data.model_dump()}"
        doctor_note = generate_medical_consultation(context)

        return MalariaResponse(
            diagnosis=result,
            confidence=confidence,
            doctor_advice=doctor_note,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Malaria Pipeline Error: {str(e)}")