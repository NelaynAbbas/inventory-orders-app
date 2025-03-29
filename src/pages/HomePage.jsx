import { Link } from 'react-router-dom'
import { ShoppingBag, Tag, BarChart3, Settings } from 'lucide-react'

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Streamline Your Ordering Process
            </h1>
            <p className="text-xl mb-8">
              A powerful ordering system that makes it easy to browse items, place orders, and manage inventory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/items" className="btn bg-white text-blue-700 hover:bg-gray-100">
                Browse Items
              </Link>
              <Link to="/staff" className="btn bg-blue-800 text-white hover:bg-blue-900">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              StreamLine provides a complete solution for managing your ordering system with powerful features for both users and staff.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Items</h3>
              <p className="text-gray-600">
                Users can easily browse available items, check stock levels, and view prices in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Tag className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply Offers</h3>
              <p className="text-gray-600">
                Automatic discount application when conditions are met, with transparent offer visibility.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Inventory</h3>
              <p className="text-gray-600">
                Staff can easily add, update, or remove items from inventory with a simple interface.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Offers</h3>
              <p className="text-gray-600">
                Create and manage promotional offers with flexible conditions and discount rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-600 mb-8">
              Start browsing our catalog or access the staff portal to manage inventory and offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/items" className="btn btn-primary">
                Browse Items
              </Link>
              <Link to="/staff" className="btn btn-secondary">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
