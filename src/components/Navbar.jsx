import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()
  
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold">StreamLine</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/items" className="text-gray-700 hover:text-blue-500">
              Browse Items
            </Link>
            <Link to="/offers" className="text-gray-700 hover:text-blue-500">
              Offers
            </Link>
            <Link to="/staff" className="text-gray-700 hover:text-blue-500">
              Staff Portal
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col gap-4">
            <Link 
              to="/items" 
              className="text-gray-700 hover:text-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Items
            </Link>
            <Link 
              to="/offers" 
              className="text-gray-700 hover:text-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Offers
            </Link>
            <Link 
              to="/staff" 
              className="text-gray-700 hover:text-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Staff Portal
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar
