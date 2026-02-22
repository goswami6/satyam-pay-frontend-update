import { useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([
    { name: 'Digital Billing', description: 'Create and manage digital invoices', enabled: true, users: 234 },
    { name: 'Payment Links', description: 'Generate shareable payment links', enabled: true, users: 456 },
    { name: 'Payment Pages', description: 'Custom payment pages', enabled: true, users: 189 },
    { name: 'QR Codes', description: 'Dynamic QR code payments', enabled: true, users: 567 },
    { name: 'Subscriptions', description: 'Recurring payment management', enabled: false, users: 89 },
    { name: 'Smart Collect', description: 'Virtual account collections', enabled: true, users: 123 },
  ]);

  const toggleProduct = (index) => {
    setProducts(prev => prev.map((p, i) => 
      i === index ? { ...p, enabled: !p.enabled } : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Products Control</h1>
          <p className="text-gray-600 mt-1">Enable or disable payment products for users</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {products.map((product, index) => (
            <div key={product.name} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <p className="text-xs text-gray-500 mt-2">{product.users} active users</p>
              </div>
              <button
                onClick={() => toggleProduct(index)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  product.enabled
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {product.enabled ? (
                  <>
                    <ToggleRight size={20} />
                    <span className="text-sm font-medium">Enabled</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={20} />
                    <span className="text-sm font-medium">Disabled</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Enabled Products</h3>
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.enabled).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Active Users</h3>
          <p className="text-2xl font-bold text-blue-600">{products.reduce((sum, p) => sum + p.users, 0)}</p>
        </div>
      </div>
    </div>
  );
};

export default Products;
