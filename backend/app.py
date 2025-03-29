from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime, timedelta

app = FastAPI(title="StreamLine API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Item(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    price: float
    stock: int

class Offer(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    category: str
    discountPercentage: float
    minQuantity: int
    validUntil: str

class OrderItem(BaseModel):
    id: str
    quantity: int

class Order(BaseModel):
    items: List[OrderItem]
    appliedOffers: List[str] = []
    subtotal: float
    discount: float
    total: float

items_db = []
offers_db = []
orders_db = []


# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
