import { Link } from 'react-router-dom'
import { ShoppingCart, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-bold">StreamLine</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Modern ordering system for businesses of all sizes.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/items" className="text-sm text-gray-600 hover:text-blue-500">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-sm text-gray-600 hover:text-blue-500">
                  Offers
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-600 hover:text-blue-500">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Staff</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/staff" className="text-sm text-gray-600 hover:text-blue-500">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/staff?tab=inventory" className="text-sm text-gray-600 hover:text-blue-500">
                  Manage Inventory
                </Link>
              </li>
              <li>
                <Link to="/staff?tab=offers" className="text-sm text-gray-600 hover:text-blue-500">
                  Manage Offers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} StreamLine. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link to="#" className="text-sm text-gray-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-gray-600 hover:text-blue-500">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
