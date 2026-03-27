import os
from pathlib import Path
from unsloth import FastLanguageModel
import torch

# Path(__file__) is chat_service.py -> .parent is services -> .parent is app
BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "weights" / "llama_doctor" / "vector_md_ultra_specialist"

# Load the Ultra-Specialist Model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = str(MODEL_PATH),
    max_seq_length = 2048,
    load_in_4bit = True,
)
FastLanguageModel.for_inference(model)

def generate_medical_consultation(combined_context: str):
    """
    Takes the scan result + patient notes and generates a clean response.
    """
    prompt = f"### System: You are a professional Doctor AI Assistant.\n### Patient: {combined_context}\n### Response:"

    inputs = tokenizer([prompt], return_tensors="pt").to("cuda")
    
    outputs = model.generate(
        **inputs,
        max_new_tokens=180,
        temperature=0.4,
        repetition_penalty=1.3,      
        no_repeat_ngram_size=3,      
        eos_token_id=tokenizer.eos_token_id
    )
    
    full_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return full_response.split("### Response:")[-1].strip()