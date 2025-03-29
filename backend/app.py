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


def init_sample_data():
    sample_items = [
        Item(
            id=str(uuid.uuid4()),
            name="Laptop",
            category="Electronics",
            price=999.99,
            stock=10
        ),
        Item(
            id=str(uuid.uuid4()),
            name="Smartphone",
            category="Electronics",
            price=699.99,
            stock=15
        ),
        Item(
            id=str(uuid.uuid4()),
            name="Headphones",
            category="Electronics",
            price=149.99,
            stock=20
        ),
        Item(
            id=str(uuid.uuid4()),
            name="T-shirt",
            category="Clothing",
            price=19.99,
            stock=50
        ),
        Item(
            id=str(uuid.uuid4()),
            name="Jeans",
            category="Clothing",
            price=49.99,
            stock=30
        ),
        Item(
            id=str(uuid.uuid4()),
            name="Coffee Maker",
            category="Home",
            price=79.99,
            stock=8
        ),
        Item(
            id=str(uuid.uuid4()),
            name="Blender",
            category="Home",
            price=39.99,
            stock=12
        ),
    ]
    
    for item in sample_items:
        items_db.append(item.dict())
    
    # Sample offers
    valid_until = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    
    sample_offers = [
        Offer(
            id=str(uuid.uuid4()),
            name="Electronics Sale",
            description="Get a discount on all electronics",
            category="Electronics",
            discountPercentage=10.0,
            minQuantity=2,
            validUntil=valid_until
        ),
        Offer(
            id=str(uuid.uuid4()),
            name="Clothing Discount",
            description="Save on clothing items",
            category="Clothing",
            discountPercentage=15.0,
            minQuantity=3,
            validUntil=valid_until
        ),
        Offer(
            id=str(uuid.uuid4()),
            name="Home Essentials",
            description="Discount on home products",
            category="Home",
            discountPercentage=20.0,
            minQuantity=1,
            validUntil=valid_until
        ),
    ]
    
    for offer in sample_offers:
        offers_db.append(offer.dict())

init_sample_data()

@app.get("/")
def read_root():
    return {"message": "Welcome to StreamLine API"}

@app.get("/items")
def get_items():
    return items_db


# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
