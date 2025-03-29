import { useState } from 'react'
import { Trash2, Plus, Minus, Tag, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    applyOffers, 
    appliedOffers, 
    discountAmount, 
    total 
  } = useCart()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return
    if (newQuantity > item.stock) {
      toast.error(`Sorry, only ${item.stock} items in stock`)
      return
    }
    updateQuantity(item.id, newQuantity)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsSubmitting(true)
    
    try {
      // In a real app, you would send the order to the backend
      const response = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity
          })),
          appliedOffers: appliedOffers.map(offer => offer.id),
          subtotal,
          discount: discountAmount,
          total
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to place order')
      }
      
      // Order successful
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/items" className="btn btn-primary">
            Browse Items
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4 text-gray-500" />
                          </button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <button 
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button 
                className="btn btn-secondary"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              
              <button 
                className="btn flex items-center gap-2"
                onClick={applyOffers}
              >
                <Tag className="h-4 w-4" />
                Apply Offers
              </button>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {appliedOffers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Tag className="h-4 w-4 text-green-500" />
                    Applied Offers
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {appliedOffers.map(offer => (
                      <li key={offer.id} className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {offer.name}: {offer.discountPercentage}% off
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button
                className="btn btn-primary w-full"
                onClick={handleCheckout}
                disabled={isSubmitting || cart.length === 0}
              >
                {isSubmitting ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
