import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent 
MODEL_PATH = BASE_DIR / "weights" / "vector_md_skin_latest.pth"

# Define the Model Architecture and Load Weights
def load_skin_model():
    checkpoint_path = str(MODEL_PATH)
    model = models.efficientnet_b0(pretrained=False)
    # Adjust the final layer to match number of classes (e.g., 7 for HAM10000)
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_ftrs, 7) 
    
    model.load_state_dict(torch.load(checkpoint_path, map_location=torch.device('cpu')))
    model.eval()
    return model

# Initialize model once at startup
SKIN_MODEL = load_skin_model()
CLASSES = ["Actinic keratoses", "Basal cell carcinoma", "Benign keratosis", "Dermatofibroma", "Melanocytic nevi", "Melanoma", "Vascular lesions"]

# Preprocessing Pipeline
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def predict_skin_condition(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    input_tensor = preprocess(image).unsqueeze(0)
    
    with torch.no_grad():
        outputs = SKIN_MODEL(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        confidence, index = torch.max(probabilities, 0)
        
    return CLASSES[index.item()], confidence.item()