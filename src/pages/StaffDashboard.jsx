import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Package, Tag, Plus, Trash2, Edit, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const StaffDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'inventory')
  
  const [items, setItems] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [editingItem, setEditingItem] = useState(null)
  const [editingOffer, setEditingOffer] = useState(null)
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  })
  
  const [newOffer, setNewOffer] = useState({
    name: '',
    description: '',
    category: '',
    discountPercentage: '',
    minQuantity: '',
    validUntil: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch items
        const itemsResponse = await fetch('http://localhost:8000/items')
        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch items')
        }
        const itemsData = await itemsResponse.json()
        setItems(itemsData)
        
        // Fetch offers
        const offersResponse = await fetch('http://localhost:8000/offers')
        if (!offersResponse.ok) {
          throw new Error('Failed to fetch offers')
        }
        const offersData = await offersResponse.json()
        setOffers(offersData)
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setSearchParams({ tab: activeTab })
  }, [activeTab, setSearchParams])

  // Item Management
  const handleAddItem = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!newItem.name || !newItem.category || !newItem.price || !newItem.stock) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      const response = await fetch('http://localhost:8000/items-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newItem,
          price: parseFloat(newItem.price),
          stock: parseInt(newItem.stock)
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add item')
      }
      
      const addedItem = await response.json()
      setItems([...items, addedItem])
      
      // Reset form
      setNewItem({
        name: '',
        category: '',
        price: '',
        stock: ''
      })
      
      toast.success('Item added successfully')
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item')
    }
  }

  const handleUpdateItem = async (e) => {
    e.preventDefault()
    
    if (!editingItem) return
    
    try {
      const response = await fetch('http://localhost:8000/items-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingItem,
          price: parseFloat(editingItem.price),
          stock: parseInt(editingItem.stock)
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update item')
      }
      
      const updatedItem = await response.json()
      
      setItems(items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ))
      
      setEditingItem(null)
      toast.success('Item updated successfully')
    } catch (error) {
      console.error('Error updating item:', error)
      toast.error('Failed to update item')
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const response = await fetch('http://localhost:8000/items-management', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: itemId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete item')
      }
      
      setItems(items.filter(item => item.id !== itemId))
      toast.success('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Failed to delete item')
    }
  }

  // Offer Management
  const handleAddOffer = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!newOffer.name || !newOffer.description || !newOffer.category || 
        !newOffer.discountPercentage || !newOffer.minQuantity || !newOffer.validUntil) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      const response = await fetch('http://localhost:8000/offers-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newOffer,
          discountPercentage: parseFloat(newOffer.discountPercentage),
          minQuantity: parseInt(newOffer.minQuantity)
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add offer')
      }
      
      const addedOffer = await response.json()
      setOffers([...offers, addedOffer])
      
      // Reset form
      setNewOffer({
        name: '',
        description: '',
        category: '',
        discountPercentage: '',
        minQuantity: '',
        validUntil: new Date().toISOString().split('T')[0]
      })
      
      toast.success('Offer added successfully')
    } catch (error) {
      console.error('Error adding offer:', error)
      toast.error('Failed to add offer')
    }
  }

  const handleUpdateOffer = async (e) => {
    e.preventDefault()
    
    if (!editingOffer) return
    
    try {
      const response = await fetch('http://localhost:8000/offers-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingOffer,
          discountPercentage: parseFloat(editingOffer.discountPercentage),
          minQuantity: parseInt(editingOffer.minQuantity)
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update offer')
      }
      
      const updatedOffer = await response.json()
      
      setOffers(offers.map(offer => 
        offer.id === updatedOffer.id ? updatedOffer : offer
      ))
      
      setEditingOffer(null)
      toast.success('Offer updated successfully')
    } catch (error) {
      console.error('Error updating offer:', error)
      toast.error('Failed to update offer')
    }
  }

  const handleDeleteOffer = async (offerId) => {
    if (!confirm('Are you sure you want to delete this offer?')) return
    
    try {
      const response = await fetch('http://localhost:8000/offers-management', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: offerId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete offer')
      }
      
      setOffers(offers.filter(offer => offer.id !== offerId))
      toast.success('Offer deleted successfully')
    } catch (error) {
      console.error('Error deleting offer:', error)
      toast.error('Failed to delete offer')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'inventory' 
              ? 'text-blue-500 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('inventory')}
        >
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory Management
          </div>
        </button>
        
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'offers' 
              ? 'text-blue-500 border-b-2 border-blue-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('offers')}
        >
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Offers Management
          </div>
        </button>
      </div>
      
      {/* Inventory Management */}
      {activeTab === 'inventory' && (
        <div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
            
            <form onSubmit={handleAddItem}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </form>
          </div>
          
          <h2 className="text-lg font-semibold mb-4">Inventory Items</h2>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map(item => (
                  <tr key={item.id}>
                    {editingItem && editingItem.id === item.id ? (
                      <td colSpan="5" className="px-6 py-4">
                        <form onSubmit={handleUpdateItem} className="grid grid-cols-5 gap-2">
                          <input
                            type="text"
                            className="input col-span-1"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            required
                          />
                          <input
                            type="text"
                            className="input col-span-1"
                            value={editingItem.category}
                            onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                            required
                          />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input col-span-1"
                            value={editingItem.price}
                            onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                            required
                          />
                          <input
                            type="number"
                            min="0"
                            className="input col-span-1"
                            value={editingItem.stock}
                            onChange={(e) => setEditingItem({...editingItem, stock: e.target.value})}
                            required
                          />
                          <div className="flex gap-2 col-span-1">
                            <button type="submit" className="p-2 bg-green-500 text-white rounded-md">
                              <Save className="h-4 w-4" />
                            </button>
                            <button 
                              type="button" 
                              className="p-2 bg-gray-200 text-gray-700 rounded-md"
                              onClick={() => setEditingItem(null)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.stock}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                
                {items.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No items found. Add some items to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Offers Management */}
      {activeTab === 'offers' && (
        <div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Offer</h2>
            
            <form onSubmit={handleAddOffer}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newOffer.name}
                    onChange={(e) => setNewOffer({...newOffer, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newOffer.category}
                    onChange={(e) => setNewOffer({...newOffer, category: e.target.value})}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="input"
                    value={newOffer.discountPercentage}
                    onChange={(e) => setNewOffer({...newOffer, discountPercentage: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input"
                    value={newOffer.minQuantity}
                    onChange={(e) => setNewOffer({...newOffer, minQuantity: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={newOffer.validUntil}
                    onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Offer
              </button>
            </form>
          </div>
          
          <h2 className="text-lg font-semibold mb-4">Current Offers</h2>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offers.map(offer => (
                  <tr key={offer.id}>
                    {editingOffer && editingOffer.id === offer.id ? (
                      <td colSpan="6" className="px-6 py-4">
                        <form onSubmit={handleUpdateOffer} className="grid grid-cols-6 gap-2">
                          <div className="col-span-2">
                            <input
                              type="text"
                              className="input mb-2"
                              value={editingOffer.name}
                              onChange={(e) => setEditingOffer({...editingOffer, name: e.target.value})}
                              required
                              placeholder="Offer Name"
                            />
                            <input
                              type="text"
                              className="input"
                              value={editingOffer.description}
                              onChange={(e) => setEditingOffer({...editingOffer, description: e.target.value})}
                              required
                              placeholder="Description"
                            />
                          </div>
                          <input
                            type="text"
                            className="input col-span-1"
                            value={editingOffer.category}
                            onChange={(e) => setEditingOffer({...editingOffer, category: e.target.value})}
                            required
                            placeholder="Category"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="input col-span-1"
                            value={editingOffer.discountPercentage}
                            onChange={(e) => setEditingOffer({...editingOffer, discountPercentage: e.target.value})}
                            required
                            placeholder="Discount %"
                          />
                          <input
                            type="number"
                            min="1"
                            className="input col-span-1"
                            value={editingOffer.minQuantity}
                            onChange={(e) => setEditingOffer({...editingOffer, minQuantity: e.target.value})}
                            required
                            placeholder="Min Qty"
                          />
                          <div className="flex gap-2 col-span-1">
                            <button type="submit" className="p-2 bg-green-500 text-white rounded-md">
                              <Save className="h-4 w-4" />
                            </button>
                            <button 
                              type="button" 
                              className="p-2 bg-gray-200 text-gray-700 rounded-md"
                              onClick={() => setEditingOffer(null)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{offer.name}</div>
                          <div className="text-xs text-gray-500">{offer.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{offer.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{offer.discountPercentage}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{offer.minQuantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(offer.validUntil).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                              onClick={() => setEditingOffer(offer)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                              onClick={() => handleDeleteOffer(offer.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                
                {offers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No offers found. Add some offers to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffDashboard
