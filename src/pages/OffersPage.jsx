import { useState, useEffect } from 'react'
import { Tag, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const OffersPage = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('http://localhost:8000/offers')
        if (!response.ok) {
          throw new Error('Failed to fetch offers')
        }
        const data = await response.json()
        setOffers(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching offers:', error)
        setError(error.message)
        setLoading(false)
        toast.error('Failed to load offers')
      }
    }

    fetchOffers()
  }, [])

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
      <h1 className="text-2xl font-bold mb-6">Current Offers</h1>
      
      {offers.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-yellow-400" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No offers available</h2>
          <p className="text-gray-600">
            There are currently no active offers. Check back later for discounts and promotions.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map(offer => (
            <div key={offer.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-blue-500 text-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">{offer.name}</h2>
                </div>
                <p className="text-blue-100">{offer.description}</p>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {offer.discountPercentage}% OFF
                  </div>
                  <div className="text-sm text-gray-600">
                    on {offer.category} items
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum Quantity:</span>
                    <span className="font-medium">{offer.minQuantity} items</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valid Until:</span>
                    <span className="font-medium">
                      {new Date(offer.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OffersPage
