import { useState, useEffect } from 'react'
import { ShoppingCart, Filter } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const ItemsPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/items')
        if (!response.ok) {
          throw new Error('Failed to fetch items')
        }
        const data = await response.json()
        setItems(data)
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))]
        setCategories(uniqueCategories)
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching items:', error)
        setError(error.message)
        setLoading(false)
        toast.error('Failed to load items')
      }
    }

    fetchItems()
  }, [])

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Items</h1>
      
      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mr-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">Filter by:</span>
        </div>
        
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            selectedCategory === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="card hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                {/* Placeholder for item image */}
                <span className="text-4xl text-gray-400">📦</span>
              </div>
              
              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.category}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                <span className={`badge ${
                  item.stock > 10 
                    ? 'badge-success' 
                    : item.stock > 0 
                      ? 'badge-warning' 
                      : 'badge-error'
                }`}>
                  {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              
              <button
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                onClick={() => addToCart(item)}
                disabled={item.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemsPage
