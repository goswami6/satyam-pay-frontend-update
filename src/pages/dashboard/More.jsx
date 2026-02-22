import { Settings, HelpCircle, FileText, Shield, Bell, CreditCard, Users, BarChart3 } from 'lucide-react';

const More = () => {
  const sections = [
    {
      title: 'Account Settings',
      items: [
        { icon: Settings, label: 'General Settings', description: 'Manage your account preferences' },
        { icon: Shield, label: 'Security', description: 'Two-factor auth, password' },
        { icon: Bell, label: 'Notifications', description: 'Email & SMS preferences' },
        { icon: Users, label: 'Team Management', description: 'Add and manage team members' },
      ]
    },
    {
      title: 'Business Tools',
      items: [
        { icon: CreditCard, label: 'Payment Methods', description: 'Manage accepted payment methods' },
        { icon: BarChart3, label: 'Analytics', description: 'Advanced business insights' },
        { icon: FileText, label: 'Invoicing', description: 'Create and manage invoices' },
        { icon: HelpCircle, label: 'Help Center', description: 'FAQs and support articles' },
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">More Options</h1>
          <p className="text-gray-300">Additional settings and tools for your business</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <item.icon className="text-gray-700" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{item.label}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="bg-blue-50 rounded-lg border border-blue-200 p-8 text-center">
          <HelpCircle className="mx-auto text-blue-600 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Need Help?</h2>
          <p className="text-gray-600 mb-6">Our support team is available 24/7 to assist you</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Contact Support
          </button>
        </section>
      </div>
    </div>
  );
};

export default More;
