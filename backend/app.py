from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime, timedelta

app = FastAPI(title="inventory-orders-app")



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
    # Sample items
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




# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to StreamLine API"}





# Items endpoints
@app.get("/items")
def get_items():
    return items_db

@app.post("/items-management")
def manage_items(item: Item):
    if item.id:
        for i, existing_item in enumerate(items_db):
            if existing_item["id"] == item.id:
                item_dict = item.dict()
                items_db[i] = item_dict
                return item_dict
        raise HTTPException(status_code=404, detail="Item not found")
    else:
        # Add new item
        item.id = str(uuid.uuid4())
        item_dict = item.dict()
        items_db.append(item_dict)
        return item_dict

@app.delete("/items-management")
def delete_item(item_id: dict):
    for i, item in enumerate(items_db):
        if item["id"] == item_id["id"]:
            deleted_item = items_db.pop(i)
            return {"message": "Item deleted", "item": deleted_item}
    raise HTTPException(status_code=404, detail="Item not found")






# Offers endpoints
@app.get("/offers")
def get_offers():
    return offers_db

@app.post("/offers-management")
def manage_offers(offer: Offer):
    if offer.id:
        for i, existing_offer in enumerate(offers_db):
            if existing_offer["id"] == offer.id:
                offer_dict = offer.dict()
                offers_db[i] = offer_dict
                return offer_dict
        raise HTTPException(status_code=404, detail="Offer not found")
    else:
        offer.id = str(uuid.uuid4())
        offer_dict = offer.dict()
        offers_db.append(offer_dict)
        return offer_dict

@app.delete("/offers-management")
def delete_offer(offer_id: dict):
    for i, offer in enumerate(offers_db):
        if offer["id"] == offer_id["id"]:
            deleted_offer = offers_db.pop(i)
            return {"message": "Offer deleted", "offer": deleted_offer}
    raise HTTPException(status_code=404, detail="Offer not found")





@app.post("/orders")
def create_order(order: Order):

    for order_item in order.items:
        item_found = False
        for item in items_db:
            if item["id"] == order_item.id:
                item_found = True
                if item["stock"] < order_item.quantity:
                    raise HTTPException(status_code=400, detail=f"Not enough stock for {item['name']}")
                item["stock"] -= order_item.quantity
                break
        if not item_found:
            raise HTTPException(status_code=404, detail=f"Item with id {order_item.id} not found")
    
    order_id = str(uuid.uuid4())
    order_dict = order.dict()
    order_dict["id"] = order_id
    order_dict["date"] = datetime.now().isoformat()
    orders_db.append(order_dict)
    
    return {"message": "Order created successfully", "order_id": order_id}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
