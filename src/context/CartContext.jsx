import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [appliedOffers, setAppliedOffers] = useState([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      
      if (existingItem) {
        // Check if adding would exceed available stock
        if (existingItem.quantity + quantity > item.stock) {
          toast.error(`Sorry, only ${item.stock} items in stock`)
          return prevCart
        }
        
        // Update quantity of existing item
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + quantity } 
            : cartItem
        )
      } else {
        // Check if adding would exceed available stock
        if (quantity > item.stock) {
          toast.error(`Sorry, only ${item.stock} items in stock`)
          return prevCart
        }
        
        // Add new item to cart
        return [...prevCart, { ...item, quantity }]
      }
    })
    
    toast.success(`Added ${quantity} ${item.name} to cart`)
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
    toast.success('Item removed from cart')
  }

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity } 
          : item
      )
    )
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    setAppliedOffers([])
    toast.success('Cart cleared')
  }

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  // Apply offers
  const applyOffers = async () => {
    try {
      // In a real app, you would send the cart to the backend to calculate applicable offers
      // For now, we'll simulate this with a timeout
      const response = await fetch('http://localhost:8000/offers')
      const offers = await response.json()
      
      // Simple offer application logic (would be more complex in a real app)
      const applicable = offers.filter(offer => {
        // Check if any item in cart matches offer criteria
        return cart.some(item => 
          item.category === offer.category && item.quantity >= offer.minQuantity
        )
      })
      
      setAppliedOffers(applicable)
      
      if (applicable.length > 0) {
        toast.success(`${applicable.length} offers applied!`)
      } else {
        toast.info('No applicable offers found')
      }
    } catch (error) {
      console.error('Error applying offers:', error)
      toast.error('Failed to apply offers')
    }
  }

  // Calculate discount amount
  const discountAmount = appliedOffers.reduce((total, offer) => {
    // Simple discount calculation (would be more complex in a real app)
    const applicableItems = cart.filter(item => item.category === offer.category)
    const applicableSubtotal = applicableItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    )
    
    return total + (applicableSubtotal * (offer.discountPercentage / 100))
  }, 0)

  // Calculate total
  const total = subtotal - discountAmount

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      applyOffers,
      appliedOffers,
      discountAmount,
      total
    }}>
      {children}
    </CartContext.Provider>
  )
}
