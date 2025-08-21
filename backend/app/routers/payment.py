from fastapi import APIRouter, HTTPException, Depends
from ...auth import get_current_user
import stripe

router = APIRouter(prefix="/payment", tags=["payment"])

stripe.api_key = "sk_test_..."  # Ganti dengan Stripe key

@router.post("/subscription")
async def create_subscription(username: str = Depends(get_current_user)):
    try:
        customer = stripe.Customer.create(name=username)
        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[{"price": "price_1..."}]  # Ganti dengan price ID Stripe
        )
        return {"message": "Subscription dibuat! ✅", "subscription_id": subscription.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
