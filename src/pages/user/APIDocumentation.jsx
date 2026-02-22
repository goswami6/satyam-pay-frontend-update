import { useState, useEffect } from "react";
import {
  Rocket,
  Key,
  CreditCard,
  CheckCircle,
  Info,
  AlertTriangle,
  Code,
  Copy,
  Webhook,
  Terminal,
  Zap,
  Shield,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const APIDocumentation = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeLanguage, setActiveLanguage] = useState("curl");
  const [copiedCode, setCopiedCode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: Rocket },
    { id: "authentication", label: "Authentication", icon: Key },
    { id: "create-order", label: "Create Order", icon: CreditCard },
    { id: "fetch-orders", label: "Fetch Orders", icon: Info },
    { id: "verify-payment", label: "Verify Payment", icon: CheckCircle },
    { id: "refunds", label: "Refunds", icon: CreditCard },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
    { id: "error-codes", label: "Error Codes", icon: AlertTriangle },
    { id: "code-examples", label: "Code Examples", icon: Code },
    { id: "test-api", label: "Test API", icon: Terminal },
  ];

  const languages = [
    { id: "curl", label: "cURL" },
    { id: "nodejs", label: "Node.js" },
    { id: "php", label: "PHP" },
    { id: "python", label: "Python" },
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) => ({
        id: s.id,
        element: document.getElementById(s.id),
      }));

      for (const section of sectionElements) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const CodeBlock = ({ code, language, id }) => (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-slate-300 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );

  const MethodBadge = ({ method }) => {
    const colors = {
      POST: "bg-green-500",
      GET: "bg-cyan-500",
      PUT: "bg-orange-500",
      DELETE: "bg-red-500",
    };
    return (
      <span className={`${colors[method]} text-white text-xs font-bold px-2 py-1 rounded`}>
        {method}
      </span>
    );
  };

  const ParamTable = ({ params }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700">Parameter</th>
            <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700">Type</th>
            <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700">Required</th>
            <th className="border border-slate-200 px-4 py-2 text-left text-sm font-semibold text-slate-700">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param, index) => (
            <tr key={index} className="hover:bg-slate-50">
              <td className="border border-slate-200 px-4 py-2">
                <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600">{param.name}</code>
              </td>
              <td className="border border-slate-200 px-4 py-2 text-sm text-slate-600">{param.type}</td>
              <td className="border border-slate-200 px-4 py-2">
                {param.required ? (
                  <span className="text-red-600 font-bold text-sm">Yes</span>
                ) : (
                  <span className="text-slate-500 text-sm">Optional</span>
                )}
              </td>
              <td className="border border-slate-200 px-4 py-2 text-sm text-slate-600">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/user/api-token" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 overflow-y-auto transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">SatyamPay</h1>
              <p className="text-xs text-slate-400">API Documentation v1.0</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${activeSection === section.id ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/user/api-token" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto px-6 py-12">

          {/* Getting Started */}
          <section id="getting-started" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Getting Started</h1>
            <p className="text-lg text-slate-600 mb-6 mt-4">
              Welcome to the SatyamPay Payment Gateway API. This documentation will help you integrate our payment system into your applications.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Base URL</h3>
            <CodeBlock code={`Test Mode: http://localhost:5000/api/v1
Live Mode: https://api.satyampay.in/api/v1`} language="URL" id="base-url" />

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Quick Start</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>Login to your dashboard and generate API credentials from the <Link to="/user/api-token" className="text-indigo-600 hover:underline">API Keys</Link> page</li>
              <li>Use HTTP Basic Auth with Key ID as username and Secret Key as password</li>
              <li>Create payment orders using POST /api/v1/orders</li>
              <li>Handle webhook notifications for payment status updates</li>
              <li>Test your integration using GET /api/v1/test endpoint</li>
            </ol>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-800">Tip</p>
                  <p className="text-blue-700 text-sm">Use the /api/v1/test endpoint to verify your API keys are working correctly.</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Available Endpoints</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-4">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 px-4 py-2 text-left">Method</th>
                    <th className="border border-slate-200 px-4 py-2 text-left">Endpoint</th>
                    <th className="border border-slate-200 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="GET" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/test</td><td className="border border-slate-200 px-4 py-2">Test API connection</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="POST" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/orders</td><td className="border border-slate-200 px-4 py-2">Create payment order</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="GET" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/orders</td><td className="border border-slate-200 px-4 py-2">List all orders</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="GET" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/orders/:orderId</td><td className="border border-slate-200 px-4 py-2">Get order details</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="POST" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/payments/verify</td><td className="border border-slate-200 px-4 py-2">Verify payment signature</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="GET" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/payments/:paymentId</td><td className="border border-slate-200 px-4 py-2">Get payment details</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="POST" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/payments/:paymentId/refunds</td><td className="border border-slate-200 px-4 py-2">Create refund</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Authentication</h1>
            <p className="text-slate-600 mt-4 mb-6">
              SatyamPay API uses HTTP Basic Authentication. You need to generate API keys from your dashboard and use them in every request.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">API Key Structure</h3>
            <ul className="space-y-2 text-slate-600 mb-6">
              <li><strong>Key ID (Test):</strong> <code className="bg-slate-100 px-2 py-1 rounded text-sm">sat_test_xxxxxxxxxxxxxxxxxxxxxxxxx</code></li>
              <li><strong>Key ID (Live):</strong> <code className="bg-slate-100 px-2 py-1 rounded text-sm">sat_live_xxxxxxxxxxxxxxxxxxxxxxxxx</code></li>
              <li><strong>Secret Key:</strong> <code className="bg-slate-100 px-2 py-1 rounded text-sm">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></li>
            </ul>

            <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-slate-800">HTTP Basic Authentication</h4>
                </div>
              </div>
              <div className="p-4">
                <p className="text-slate-600 mb-3">Use your Key ID as the username and Secret Key as the password:</p>
                <CodeBlock code={`// Authorization Header Format
Authorization: Basic base64(key_id:secret_key)

// Example:
// Key ID:  sat_test_a1b2c3d4e5f6g7h8
// Secret:  xyz789secret123abc456def
// Base64:  c2F0X3Rlc3RfYTFiMmMzZDRlNWY2ZzdoODp4eXo3ODlzZWNyZXQxMjNhYmM0NTZkZWY=

Authorization: Basic c2F0X3Rlc3RfYTFiMmMzZDRlNWY2ZzdoODp4eXo3ODlzZWNyZXQxMjNhYmM0NTZkZWY=`} language="Headers" id="basic-auth" />
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h4 className="font-semibold text-slate-800">cURL Example</h4>
              </div>
              <div className="p-4">
                <p className="text-slate-600 mb-3">Use the -u flag for Basic Auth in cURL:</p>
                <CodeBlock code={`curl -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  http://localhost:5000/api/v1/test`} language="bash" id="curl-auth" />
              </div>
            </div>
          </section>

          {/* Create Order */}
          <section id="create-order" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Create Order</h1>

            <div className="border-l-4 border-indigo-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="POST" />
                <code className="font-mono text-sm text-slate-700">/api/v1/orders</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Create a new payment order. Returns an order object with payment URL.</p>

                <h5 className="font-semibold text-slate-800 mb-3">Request Parameters</h5>
                <ParamTable params={[
                  { name: "amount", type: "integer", required: true, description: "Amount in paise (e.g., 50000 = ₹500.00)" },
                  { name: "currency", type: "string", required: false, description: "Currency code (default: INR)" },
                  { name: "receipt", type: "string", required: false, description: "Your unique receipt/order identifier" },
                  { name: "notes", type: "object", required: false, description: "Key-value pairs for additional data" },
                  { name: "callback_url", type: "string", required: false, description: "URL to redirect after payment" },
                  { name: "webhook_url", type: "string", required: false, description: "URL for payment notifications" },
                ]} />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Example Request</h5>
                <CodeBlock code={`curl -X POST http://localhost:5000/api/v1/orders \\
  -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50000,
    "currency": "INR",
    "receipt": "order_rcptid_11",
    "notes": {
      "customer_name": "John Doe",
      "customer_email": "john@example.com"
    },
    "callback_url": "https://yoursite.com/payment/callback",
    "webhook_url": "https://yoursite.com/api/webhook"
  }'`} language="bash" id="create-order-req" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <CodeBlock code={`{
  "id": "order_ABC123XYZ",
  "entity": "order",
  "amount": 50000,
  "amount_paid": 0,
  "amount_due": 50000,
  "currency": "INR",
  "receipt": "order_rcptid_11",
  "status": "created",
  "payment_url": "http://localhost:5173/pay/order_ABC123XYZ",
  "created_at": 1740000000
}`} language="JSON" id="create-order-res" />
                </div>
              </div>
            </div>
          </section>

          {/* Fetch Orders */}
          <section id="fetch-orders" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Fetch Orders</h1>

            <div className="border-l-4 border-cyan-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="GET" />
                <code className="font-mono text-sm text-slate-700">/api/v1/orders</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Fetch all orders for your account.</p>
                <h5 className="font-semibold text-slate-800 mb-3">Query Parameters</h5>
                <ParamTable params={[
                  { name: "count", type: "integer", required: false, description: "Number of orders to return (default: 10)" },
                  { name: "skip", type: "integer", required: false, description: "Number of orders to skip (for pagination)" },
                ]} />
                <CodeBlock code={`curl -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  "http://localhost:5000/api/v1/orders?count=10&skip=0"`} language="bash" id="list-orders" />
              </div>
            </div>

            <div className="border-l-4 border-cyan-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="GET" />
                <code className="font-mono text-sm text-slate-700">/api/v1/orders/:orderId</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Fetch details of a specific order.</p>
                <CodeBlock code={`curl -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/orders/order_ABC123XYZ`} language="bash" id="get-order" />
              </div>
            </div>
          </section>

          {/* Verify Payment */}
          <section id="verify-payment" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Verify Payment</h1>

            <div className="border-l-4 border-green-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="POST" />
                <code className="font-mono text-sm text-slate-700">/api/v1/payments/verify</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Verify payment signature to confirm payment authenticity.</p>

                <h5 className="font-semibold text-slate-800 mb-3">Request Parameters</h5>
                <ParamTable params={[
                  { name: "order_id", type: "string", required: true, description: "The order ID" },
                  { name: "payment_id", type: "string", required: true, description: "The payment ID received after payment" },
                  { name: "signature", type: "string", required: true, description: "The signature to verify" },
                ]} />

                <CodeBlock code={`curl -X POST http://localhost:5000/api/v1/payments/verify \\
  -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "order_id": "order_ABC123XYZ",
    "payment_id": "pay_DEF456UVW",
    "signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
  }'`} language="bash" id="verify-payment" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <CodeBlock code={`{
  "status": "verified",
  "message": "Payment signature verified successfully"
}`} language="JSON" id="verify-res" />
              </div>
            </div>
          </section>

          {/* Refunds */}
          <section id="refunds" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Refunds</h1>

            <div className="border-l-4 border-orange-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="POST" />
                <code className="font-mono text-sm text-slate-700">/api/v1/payments/:paymentId/refunds</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Create a refund for a captured payment.</p>

                <h5 className="font-semibold text-slate-800 mb-3">Request Parameters</h5>
                <ParamTable params={[
                  { name: "amount", type: "integer", required: false, description: "Refund amount in paise (default: full amount)" },
                  { name: "notes", type: "object", required: false, description: "Additional notes for the refund" },
                ]} />

                <CodeBlock code={`curl -X POST http://localhost:5000/api/v1/payments/pay_DEF456UVW/refunds \\
  -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "notes": {
      "reason": "Customer requested refund"
    }
  }'`} language="bash" id="create-refund" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <CodeBlock code={`{
  "id": "rfnd_GHI789RST",
  "entity": "refund",
  "amount": 25000,
  "currency": "INR",
  "payment_id": "pay_DEF456UVW",
  "status": "processed",
  "created_at": 1740000000
}`} language="JSON" id="refund-res" />
              </div>
            </div>
          </section>

          {/* Webhooks */}
          <section id="webhooks" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Webhooks</h1>
            <p className="text-slate-600 mt-4 mb-6">
              Webhooks allow you to receive real-time notifications when payment events occur.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Webhook Events</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 px-4 py-2 text-left">Event</th>
                    <th className="border border-slate-200 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm">payment.authorized</td><td className="border border-slate-200 px-4 py-2">Payment has been authorized</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm">payment.captured</td><td className="border border-slate-200 px-4 py-2">Payment has been captured</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm">payment.failed</td><td className="border border-slate-200 px-4 py-2">Payment has failed</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm">order.paid</td><td className="border border-slate-200 px-4 py-2">Order has been fully paid</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm">refund.created</td><td className="border border-slate-200 px-4 py-2">Refund has been initiated</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Webhook Payload Example</h3>
            <CodeBlock code={`{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_DEF456UVW",
        "order_id": "order_ABC123XYZ",
        "amount": 50000,
        "currency": "INR",
        "status": "captured",
        "method": "upi",
        "email": "john@example.com",
        "contact": "+919876543210"
      }
    }
  },
  "created_at": 1740000000
}`} language="JSON" id="webhook-payload" />
          </section>

          {/* Error Codes */}
          <section id="error-codes" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Error Codes</h1>

            <div className="overflow-x-auto mt-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 px-4 py-2 text-left">Code</th>
                    <th className="border border-slate-200 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm text-red-600">UNAUTHORIZED</td><td className="border border-slate-200 px-4 py-2">API key is required or invalid</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm text-red-600">BAD_REQUEST_ERROR</td><td className="border border-slate-200 px-4 py-2">Invalid request parameters</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm text-red-600">SERVER_ERROR</td><td className="border border-slate-200 px-4 py-2">Internal server error</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Error Response Format</h3>
            <CodeBlock code={`{
  "error": {
    "code": "BAD_REQUEST_ERROR",
    "description": "The amount field is required and must be greater than 0",
    "source": "business",
    "field": "amount"
  }
}`} language="JSON" id="error-format" />
          </section>

          {/* Code Examples */}
          <section id="code-examples" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Code Examples</h1>
            <p className="text-slate-600 mt-4 mb-6">Complete working examples in different programming languages.</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setActiveLanguage(lang.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLanguage === lang.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {activeLanguage === "curl" && (
              <CodeBlock code={`# Create Order
curl -X POST http://localhost:5000/api/v1/orders \\
  -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 50000, "currency": "INR", "receipt": "order_123"}'

# Fetch Order
curl -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/orders/order_ABC123XYZ

# Test Connection
curl -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/test`} language="bash" id="curl-examples" />
            )}

            {activeLanguage === "nodejs" && (
              <CodeBlock code={`const axios = require('axios');

const keyId = 'sat_test_YOUR_KEY_ID';
const secretKey = 'YOUR_SECRET_KEY';

// Create Order
const createOrder = async () => {
  const response = await axios.post(
    'http://localhost:5000/api/v1/orders',
    {
      amount: 50000,
      currency: 'INR',
      receipt: 'order_123',
      notes: { customer: 'John Doe' }
    },
    {
      auth: { username: keyId, password: secretKey }
    }
  );
  
  console.log('Order created:', response.data);
  return response.data;
};

// Fetch Order
const fetchOrder = async (orderId) => {
  const response = await axios.get(
    \`http://localhost:5000/api/v1/orders/\${orderId}\`,
    { auth: { username: keyId, password: secretKey } }
  );
  return response.data;
};

createOrder();`} language="JavaScript" id="nodejs-examples" />
            )}

            {activeLanguage === "php" && (
              <CodeBlock code={`<?php
$keyId = 'sat_test_YOUR_KEY_ID';
$secretKey = 'YOUR_SECRET_KEY';
$baseUrl = 'http://localhost:5000/api/v1';

// Create Order
function createOrder($amount, $receipt) {
    global $keyId, $secretKey, $baseUrl;
    
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $baseUrl . '/orders',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_USERPWD => $keyId . ':' . $secretKey,
        CURLOPT_POSTFIELDS => json_encode([
            'amount' => $amount,
            'currency' => 'INR',
            'receipt' => $receipt
        ]),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json']
    ]);
    
    $response = curl_exec($curl);
    curl_close($curl);
    
    return json_decode($response, true);
}

// Create order for ₹500
$order = createOrder(50000, 'order_123');
echo 'Payment URL: ' . $order['payment_url'];
?>`} language="PHP" id="php-examples" />
            )}

            {activeLanguage === "python" && (
              <CodeBlock code={`import requests

key_id = 'sat_test_YOUR_KEY_ID'
secret_key = 'YOUR_SECRET_KEY'
base_url = 'http://localhost:5000/api/v1'

# Create Order
def create_order(amount, receipt):
    response = requests.post(
        f'{base_url}/orders',
        auth=(key_id, secret_key),
        json={
            'amount': amount,
            'currency': 'INR',
            'receipt': receipt
        }
    )
    return response.json()

# Fetch Order
def fetch_order(order_id):
    response = requests.get(
        f'{base_url}/orders/{order_id}',
        auth=(key_id, secret_key)
    )
    return response.json()

# Create order for ₹500
order = create_order(50000, 'order_123')
print(f"Payment URL: {order['payment_url']}")`} language="Python" id="python-examples" />
            )}
          </section>

          {/* Test API */}
          <section id="test-api" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-indigo-500">Test API</h1>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mt-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Terminal className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-800">Test Your Integration</p>
                  <p className="text-purple-700 text-sm">Use the test endpoint to verify your API keys are configured correctly.</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-cyan-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="GET" />
                <code className="font-mono text-sm text-slate-700">/api/v1/test</code>
              </div>
              <div className="p-6">
                <CodeBlock code={`curl -u sat_test_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/test`} language="bash" id="test-api-curl" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <CodeBlock code={`{
  "success": true,
  "message": "API connection successful!",
  "user": {
    "email": "user@example.com",
    "mode": "test",
    "keyId": "sat_test_abc123..."
  },
  "timestamp": "2026-02-17T12:00:00.000Z"
}`} language="JSON" id="test-success" />
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default APIDocumentation;
