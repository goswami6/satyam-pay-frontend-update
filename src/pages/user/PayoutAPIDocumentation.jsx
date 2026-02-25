import { useState, useEffect } from "react";
import {
  Rocket,
  Key,
  Banknote,
  CheckCircle,
  Info,
  AlertTriangle,
  Code,
  Copy,
  Terminal,
  Zap,
  Shield,
  ArrowLeft,
  Menu,
  X,
  Wallet,
  Send,
  XCircle,
  ListFilter,
} from "lucide-react";
import { Link } from "react-router-dom";

const PayoutAPIDocumentation = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeLanguage, setActiveLanguage] = useState("curl");
  const [copiedCode, setCopiedCode] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: Rocket },
    { id: "authentication", label: "Authentication", icon: Key },
    { id: "get-balance", label: "Get Balance", icon: Wallet },
    { id: "create-payout-bank", label: "Create Payout (Bank)", icon: Banknote },
    { id: "create-payout-upi", label: "Create Payout (UPI)", icon: Send },
    { id: "get-payout", label: "Get Payout", icon: Info },
    { id: "list-payouts", label: "List Payouts", icon: ListFilter },
    { id: "cancel-payout", label: "Cancel Payout", icon: XCircle },
    { id: "payout-status", label: "Payout Statuses", icon: CheckCircle },
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
          <Link to="/user/payout-api-token" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600">
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
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">SatyamPay</h1>
              <p className="text-xs text-slate-400">Payout API v1.0</p>
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
          <Link to="/user/payout-api-token" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Getting Started</h1>
            <p className="text-lg text-slate-600 mb-6 mt-4">
              Welcome to the SatyamPay Payout API. This API allows you to programmatically send money to bank accounts or UPI IDs. All payout requests require admin approval before the amount is deducted from your account.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">Important</p>
                  <p className="text-amber-700 text-sm">All payouts require admin approval. Money is deducted from your account only after admin approves the request.</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Base URL</h3>
            <CodeBlock code={`Live Mode: http://localhost:5000/api/v1`} language="URL" id="base-url" />

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Quick Start</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>Generate Payout API credentials from the <Link to="/user/payout-api-token" className="text-indigo-600 hover:underline">Payout API Token</Link> page</li>
              <li>Wait for admin approval of your API token request</li>
              <li>Use HTTP Basic Auth with Key ID as username and Secret Key as password</li>
              <li>Check your balance using GET /api/v1/balance</li>
              <li>Create payout requests using POST /api/v1/payouts</li>
              <li>Wait for admin approval - amount deducted after approval</li>
            </ol>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-800">Tip</p>
                  <p className="text-blue-700 text-sm">Use the /api/v1/test endpoint to verify your API keys are working correctly before making payout requests.</p>
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
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="GET" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/balance</td><td className="border border-slate-200 px-4 py-2">Get account balance</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="POST" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/payouts</td><td className="border border-slate-200 px-4 py-2">Create payout request</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="GET" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/payouts</td><td className="border border-slate-200 px-4 py-2">List all payouts</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="GET" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/payouts/:payoutId</td><td className="border border-slate-200 px-4 py-2">Get payout details</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2"><MethodBadge method="POST" /></td><td className="border border-slate-200 px-4 py-2 font-mono text-sm">/api/v1/payouts/:payoutId/cancel</td><td className="border border-slate-200 px-4 py-2">Cancel pending payout</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Authentication</h1>
            <p className="text-slate-600 mt-4 mb-6">
              SatyamPay Payout API uses HTTP Basic Authentication. You need to request Payout API keys from your dashboard and wait for admin approval.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">API Key Structure</h3>
            <ul className="space-y-2 text-slate-600 mb-6">
              <li><strong>Key ID:</strong> <code className="bg-slate-100 px-2 py-1 rounded text-sm">sat_live_xxxxxxxxxxxxxxxxxxxxxxxxx</code></li>
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
// Key ID:  sat_live_df46b3bd9c2ea5adf82dd179
// Secret:  dbb9455cc09c4bb87baf2a73a9ea20ccb09c7649691a6d7792fc8b9dcbe51057
// Base64:  c2F0X2xpdmVfZGY0NmIzYmQ5YzJlYTVhZGY4MmRkMTc5OmRiYjk0NTVjYzA5YzRiYjg3

Authorization: Basic c2F0X2xpdmVfZGY0NmIzYmQ5YzJlYTVhZGY4MmRkMTc5OmRiYjk0NTVjYzA5YzRiYjg3`} language="Headers" id="basic-auth" />
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h4 className="font-semibold text-slate-800">cURL Example</h4>
              </div>
              <div className="p-4">
                <p className="text-slate-600 mb-3">Use the -u flag for Basic Auth in cURL:</p>
                <CodeBlock code={`curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  http://localhost:5000/api/v1/test`} language="bash" id="curl-auth" />
              </div>
            </div>
          </section>

          {/* Get Balance */}
          <section id="get-balance" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Get Balance</h1>

            <div className="border-l-4 border-cyan-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="GET" />
                <code className="font-mono text-sm text-slate-700">/api/v1/balance</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Check your current account balance before making payout requests.</p>

                <h5 className="font-semibold text-slate-800 mb-3">Example Request</h5>
                <CodeBlock code={`curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/balance`} language="bash" id="get-balance-req" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <CodeBlock code={`{
  "entity": "balance",
  "balance": 50000,
  "currency": "INR",
  "balance_formatted": "₹500.00"
}`} language="JSON" id="get-balance-res" />
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-blue-700 text-sm"><strong>Note:</strong> Balance is returned in paise. 50000 paise = ₹500.00</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Create Payout (Bank) */}
          <section id="create-payout-bank" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Create Payout (Bank Transfer)</h1>

            <div className="border-l-4 border-green-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="POST" />
                <code className="font-mono text-sm text-slate-700">/api/v1/payouts</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Create a payout request to a bank account. This request will be sent for admin approval.</p>

                <h5 className="font-semibold text-slate-800 mb-3">Request Parameters</h5>
                <ParamTable params={[
                  { name: "amount", type: "integer", required: true, description: "Amount in paise (e.g., 50000 = ₹500.00)" },
                  { name: "currency", type: "string", required: false, description: "Currency code (default: INR)" },
                  { name: "method", type: "string", required: true, description: "Set to 'bank' for bank transfer" },
                  { name: "bank_account", type: "object", required: true, description: "Bank account details object" },
                  { name: "bank_account.account_number", type: "string", required: true, description: "Beneficiary account number" },
                  { name: "bank_account.ifsc_code", type: "string", required: true, description: "Bank IFSC code" },
                  { name: "bank_account.account_holder_name", type: "string", required: true, description: "Account holder's name" },
                  { name: "bank_account.bank_name", type: "string", required: false, description: "Bank name (optional)" },
                  { name: "notes", type: "object", required: false, description: "Key-value pairs for additional data" },
                ]} />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Example Request</h5>
                <CodeBlock code={`curl -X POST http://localhost:5000/api/v1/payouts \\
  -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50000,
    "currency": "INR",
    "method": "bank",
    "bank_account": {
      "account_number": "1234567890",
      "ifsc_code": "HDFC0001234",
      "account_holder_name": "John Doe",
      "bank_name": "HDFC Bank"
    },
    "notes": {
      "purpose": "Vendor payment",
      "invoice_id": "INV-001"
    }
  }'`} language="bash" id="create-bank-payout-req" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <CodeBlock code={`{
  "id": "pout_1a2b3c4d5e6f7g8h9i0j",
  "entity": "payout",
  "amount": 50000,
  "currency": "INR",
  "method": "bank",
  "status": "requested",
  "bank_account": {
    "account_number": "******7890",
    "ifsc_code": "HDFC0001234",
    "account_holder_name": "John Doe",
    "bank_name": "HDFC Bank"
  },
  "upi": null,
  "notes": {
    "purpose": "Vendor payment",
    "invoice_id": "INV-001"
  },
  "created_at": 1708770600,
  "message": "Payout request submitted for admin approval"
}`} language="JSON" id="create-bank-payout-res" />
                </div>
              </div>
            </div>
          </section>

          {/* Create Payout (UPI) */}
          <section id="create-payout-upi" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Create Payout (UPI Transfer)</h1>

            <div className="border-l-4 border-green-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="POST" />
                <code className="font-mono text-sm text-slate-700">/api/v1/payouts</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Create a payout request to a UPI ID. This request will be sent for admin approval.</p>

                <h5 className="font-semibold text-slate-800 mb-3">Request Parameters</h5>
                <ParamTable params={[
                  { name: "amount", type: "integer", required: true, description: "Amount in paise (e.g., 25000 = ₹250.00)" },
                  { name: "currency", type: "string", required: false, description: "Currency code (default: INR)" },
                  { name: "method", type: "string", required: true, description: "Set to 'upi' for UPI transfer" },
                  { name: "upi", type: "object", required: true, description: "UPI details object" },
                  { name: "upi.upi_id", type: "string", required: true, description: "Beneficiary UPI ID" },
                  { name: "notes", type: "object", required: false, description: "Key-value pairs for additional data" },
                ]} />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Example Request</h5>
                <CodeBlock code={`curl -X POST http://localhost:5000/api/v1/payouts \\
  -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "INR",
    "method": "upi",
    "upi": {
      "upi_id": "john@upi"
    },
    "notes": {
      "purpose": "Refund",
      "order_id": "ORD-12345"
    }
  }'`} language="bash" id="create-upi-payout-req" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <CodeBlock code={`{
  "id": "pout_9i8h7g6f5e4d3c2b1a0",
  "entity": "payout",
  "amount": 25000,
  "currency": "INR",
  "method": "upi",
  "status": "requested",
  "bank_account": null,
  "upi": {
    "upi_id": "john@upi"
  },
  "notes": {
    "purpose": "Refund",
    "order_id": "ORD-12345"
  },
  "created_at": 1708770600,
  "message": "Payout request submitted for admin approval"
}`} language="JSON" id="create-upi-payout-res" />
                </div>
              </div>
            </div>
          </section>

          {/* Get Payout */}
          <section id="get-payout" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Get Payout Details</h1>

            <div className="border-l-4 border-cyan-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="GET" />
                <code className="font-mono text-sm text-slate-700">/api/v1/payouts/:payoutId</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Fetch details of a specific payout by its ID.</p>

                <h5 className="font-semibold text-slate-800 mb-3">Example Request</h5>
                <CodeBlock code={`curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/payouts/pout_1a2b3c4d5e6f7g8h9i0j`} language="bash" id="get-payout-req" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <CodeBlock code={`{
  "id": "pout_1a2b3c4d5e6f7g8h9i0j",
  "entity": "payout",
  "amount": 50000,
  "currency": "INR",
  "method": "bank",
  "status": "completed",
  "bank_account": {
    "account_number": "******7890",
    "ifsc_code": "HDFC0001234",
    "account_holder_name": "John Doe",
    "bank_name": "HDFC Bank"
  },
  "upi": null,
  "notes": {},
  "failure_reason": null,
  "transaction_id": "TXN123456789",
  "created_at": 1708770600,
  "approved_at": 1708771200,
  "completed_at": 1708772000
}`} language="JSON" id="get-payout-res" />
              </div>
            </div>
          </section>

          {/* List Payouts */}
          <section id="list-payouts" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">List Payouts</h1>

            <div className="border-l-4 border-cyan-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="GET" />
                <code className="font-mono text-sm text-slate-700">/api/v1/payouts</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Fetch all payouts for your account with optional filtering and pagination.</p>

                <h5 className="font-semibold text-slate-800 mb-3">Query Parameters</h5>
                <ParamTable params={[
                  { name: "status", type: "string", required: false, description: "Filter by status: requested, approved, rejected, processing, completed, failed, cancelled" },
                  { name: "count", type: "integer", required: false, description: "Number of records to return (default: 10, max: 100)" },
                  { name: "skip", type: "integer", required: false, description: "Number of records to skip for pagination (default: 0)" },
                ]} />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Example Requests</h5>
                <CodeBlock code={`# Get all payouts
curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/payouts

# Get pending payouts only
curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  "http://localhost:5000/api/v1/payouts?status=requested"

# Pagination (get 20 records, skip first 10)
curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  "http://localhost:5000/api/v1/payouts?count=20&skip=10"`} language="bash" id="list-payouts-req" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <CodeBlock code={`{
  "entity": "collection",
  "count": 2,
  "total": 15,
  "items": [
    {
      "id": "pout_1a2b3c4d5e6f7g8h9i0j",
      "entity": "payout",
      "amount": 50000,
      "currency": "INR",
      "method": "bank",
      "status": "completed",
      "bank_account": {
        "account_number": "******7890",
        "ifsc_code": "HDFC0001234",
        "account_holder_name": "John Doe"
      },
      "upi": null,
      "created_at": 1708770600
    },
    {
      "id": "pout_9i8h7g6f5e4d3c2b1a0",
      "entity": "payout",
      "amount": 25000,
      "currency": "INR",
      "method": "upi",
      "status": "requested",
      "bank_account": null,
      "upi": {
        "upi_id": "john@upi"
      },
      "created_at": 1708769000
    }
  ]
}`} language="JSON" id="list-payouts-res" />
              </div>
            </div>
          </section>

          {/* Cancel Payout */}
          <section id="cancel-payout" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Cancel Payout</h1>

            <div className="border-l-4 border-orange-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="POST" />
                <code className="font-mono text-sm text-slate-700">/api/v1/payouts/:payoutId/cancel</code>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">Cancel a pending payout request. Only payouts with status 'requested' can be cancelled.</p>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <p className="text-amber-700 text-sm"><strong>Note:</strong> You can only cancel payouts that are in 'requested' status. Once approved, the payout cannot be cancelled.</p>
                  </div>
                </div>

                <h5 className="font-semibold text-slate-800 mb-3">Example Request</h5>
                <CodeBlock code={`curl -X POST http://localhost:5000/api/v1/payouts/pout_1a2b3c4d5e6f7g8h9i0j/cancel \\
  -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY`} language="bash" id="cancel-payout-req" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <CodeBlock code={`{
  "id": "pout_1a2b3c4d5e6f7g8h9i0j",
  "entity": "payout",
  "status": "cancelled",
  "message": "Payout cancelled successfully"
}`} language="JSON" id="cancel-payout-res" />
              </div>
            </div>
          </section>

          {/* Payout Statuses */}
          <section id="payout-status" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Payout Statuses</h1>
            <p className="text-slate-600 mt-4 mb-6">
              Understanding the different stages a payout goes through.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 px-4 py-2 text-left">Status</th>
                    <th className="border border-slate-200 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-sm font-medium">requested</span>
                    </td>
                    <td className="border border-slate-200 px-4 py-2">Payout request created, waiting for admin approval</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">approved</span>
                    </td>
                    <td className="border border-slate-200 px-4 py-2">Admin approved the payout, amount deducted from balance</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">rejected</span>
                    </td>
                    <td className="border border-slate-200 px-4 py-2">Admin rejected the payout request</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium">processing</span>
                    </td>
                    <td className="border border-slate-200 px-4 py-2">Payout is being processed for transfer</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">completed</span>
                    </td>
                    <td className="border border-slate-200 px-4 py-2">Payout successfully transferred to beneficiary</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">failed</span>
                    </td>
                    <td className="border border-slate-200 px-4 py-2">Payout transfer failed</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-4 py-2">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">cancelled</span>
                    </td>
                    <td className="border border-slate-200 px-4 py-2">Payout was cancelled by user</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Payout Flow</h3>
            <div className="bg-slate-100 p-4 rounded-lg mt-4">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium">requested</div>
                <span className="text-slate-400">→</span>
                <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">approved</div>
                <span className="text-slate-400">→</span>
                <div className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">processing</div>
                <span className="text-slate-400">→</span>
                <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium">completed</div>
              </div>
            </div>
          </section>

          {/* Error Codes */}
          <section id="error-codes" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Error Codes</h1>

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
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm text-red-600">INSUFFICIENT_BALANCE</td><td className="border border-slate-200 px-4 py-2">Not enough balance for payout</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm text-red-600">NOT_FOUND_ERROR</td><td className="border border-slate-200 px-4 py-2">Payout not found</td></tr>
                  <tr><td className="border border-slate-200 px-4 py-2 font-mono text-sm text-red-600">SERVER_ERROR</td><td className="border border-slate-200 px-4 py-2">Internal server error</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">Error Response Format</h3>
            <CodeBlock code={`{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "description": "Insufficient balance. Available: ₹500.00, Required: ₹1000.00"
  }
}`} language="JSON" id="error-format" />
          </section>

          {/* Code Examples */}
          <section id="code-examples" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Code Examples</h1>
            <p className="text-slate-600 mt-4 mb-6">Complete working examples in different programming languages.</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setActiveLanguage(lang.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeLanguage === lang.id ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {activeLanguage === "curl" && (
              <CodeBlock code={`# Check Balance
curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/balance

# Create Bank Payout (₹500)
curl -X POST http://localhost:5000/api/v1/payouts \\
  -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 50000, "method": "bank", "bank_account": {"account_number": "1234567890", "ifsc_code": "HDFC0001234", "account_holder_name": "John Doe"}}'

# Create UPI Payout (₹250)
curl -X POST http://localhost:5000/api/v1/payouts \\
  -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 25000, "method": "upi", "upi": {"upi_id": "john@upi"}}'

# Get Payout Status
curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/payouts/pout_ABC123XYZ

# List All Payouts
curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/payouts

# Cancel Payout
curl -X POST http://localhost:5000/api/v1/payouts/pout_ABC123XYZ/cancel \\
  -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY`} language="bash" id="curl-examples" />
            )}

            {activeLanguage === "nodejs" && (
              <CodeBlock code={`const axios = require('axios');

const keyId = 'sat_live_YOUR_KEY_ID';
const secretKey = 'YOUR_SECRET_KEY';
const baseUrl = 'http://localhost:5000/api/v1';

// Get Balance
const getBalance = async () => {
  const response = await axios.get(\`\${baseUrl}/balance\`, {
    auth: { username: keyId, password: secretKey }
  });
  console.log('Balance:', response.data.balance_formatted);
  return response.data;
};

// Create Bank Payout
const createBankPayout = async () => {
  const response = await axios.post(
    \`\${baseUrl}/payouts\`,
    {
      amount: 50000, // ₹500 in paise
      currency: 'INR',
      method: 'bank',
      bank_account: {
        account_number: '1234567890',
        ifsc_code: 'HDFC0001234',
        account_holder_name: 'John Doe',
        bank_name: 'HDFC Bank'
      },
      notes: { purpose: 'Vendor payment' }
    },
    { auth: { username: keyId, password: secretKey } }
  );
  console.log('Payout Created:', response.data);
  return response.data;
};

// Create UPI Payout
const createUPIPayout = async () => {
  const response = await axios.post(
    \`\${baseUrl}/payouts\`,
    {
      amount: 25000, // ₹250 in paise
      method: 'upi',
      upi: { upi_id: 'john@upi' }
    },
    { auth: { username: keyId, password: secretKey } }
  );
  return response.data;
};

// Get Payout Status
const getPayoutStatus = async (payoutId) => {
  const response = await axios.get(
    \`\${baseUrl}/payouts/\${payoutId}\`,
    { auth: { username: keyId, password: secretKey } }
  );
  return response.data;
};

// Run
getBalance().then(() => createBankPayout());`} language="JavaScript" id="nodejs-examples" />
            )}

            {activeLanguage === "php" && (
              <CodeBlock code={`<?php
$keyId = 'sat_live_YOUR_KEY_ID';
$secretKey = 'YOUR_SECRET_KEY';
$baseUrl = 'http://localhost:5000/api/v1';

// Get Balance
function getBalance() {
    global $keyId, $secretKey, $baseUrl;
    
    $ch = curl_init($baseUrl . '/balance');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, $keyId . ':' . $secretKey);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Create Bank Payout
function createBankPayout($amount, $accountNumber, $ifscCode, $accountHolderName) {
    global $keyId, $secretKey, $baseUrl;
    
    $data = [
        'amount' => $amount,
        'currency' => 'INR',
        'method' => 'bank',
        'bank_account' => [
            'account_number' => $accountNumber,
            'ifsc_code' => $ifscCode,
            'account_holder_name' => $accountHolderName
        ]
    ];
    
    $ch = curl_init($baseUrl . '/payouts');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_USERPWD => $keyId . ':' . $secretKey,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json']
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Create UPI Payout
function createUPIPayout($amount, $upiId) {
    global $keyId, $secretKey, $baseUrl;
    
    $data = [
        'amount' => $amount,
        'method' => 'upi',
        'upi' => ['upi_id' => $upiId]
    ];
    
    $ch = curl_init($baseUrl . '/payouts');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_USERPWD => $keyId . ':' . $secretKey,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json']
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Usage
$balance = getBalance();
echo 'Balance: ' . $balance['balance_formatted'] . "\\n";

$payout = createBankPayout(50000, '1234567890', 'HDFC0001234', 'John Doe');
echo 'Payout ID: ' . $payout['id'] . "\\n";
?>`} language="PHP" id="php-examples" />
            )}

            {activeLanguage === "python" && (
              <CodeBlock code={`import requests

key_id = 'sat_live_YOUR_KEY_ID'
secret_key = 'YOUR_SECRET_KEY'
base_url = 'http://localhost:5000/api/v1'

# Get Balance
def get_balance():
    response = requests.get(
        f'{base_url}/balance',
        auth=(key_id, secret_key)
    )
    data = response.json()
    print(f"Balance: {data['balance_formatted']}")
    return data

# Create Bank Payout
def create_bank_payout(amount, account_number, ifsc_code, account_holder_name):
    response = requests.post(
        f'{base_url}/payouts',
        auth=(key_id, secret_key),
        json={
            'amount': amount,
            'currency': 'INR',
            'method': 'bank',
            'bank_account': {
                'account_number': account_number,
                'ifsc_code': ifsc_code,
                'account_holder_name': account_holder_name
            }
        }
    )
    return response.json()

# Create UPI Payout
def create_upi_payout(amount, upi_id):
    response = requests.post(
        f'{base_url}/payouts',
        auth=(key_id, secret_key),
        json={
            'amount': amount,
            'method': 'upi',
            'upi': {'upi_id': upi_id}
        }
    )
    return response.json()

# Get Payout Status
def get_payout_status(payout_id):
    response = requests.get(
        f'{base_url}/payouts/{payout_id}',
        auth=(key_id, secret_key)
    )
    return response.json()

# List Payouts
def list_payouts(status=None, count=10):
    params = {'count': count}
    if status:
        params['status'] = status
    
    response = requests.get(
        f'{base_url}/payouts',
        auth=(key_id, secret_key),
        params=params
    )
    return response.json()

# Usage
if __name__ == '__main__':
    # Check balance
    get_balance()
    
    # Create bank payout for ₹500
    payout = create_bank_payout(50000, '1234567890', 'HDFC0001234', 'John Doe')
    print(f"Payout ID: {payout['id']}")
    print(f"Status: {payout['status']}")`} language="Python" id="python-examples" />
            )}
          </section>

          {/* Test API */}
          <section id="test-api" className="mb-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 pb-3 border-b-2 border-emerald-500">Test API</h1>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mt-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Terminal className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-800">Test Your Integration</p>
                  <p className="text-purple-700 text-sm">Use the test endpoint to verify your Payout API keys are configured correctly.</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-cyan-500 bg-white shadow-sm rounded-r-lg overflow-hidden mt-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                <MethodBadge method="GET" />
                <code className="font-mono text-sm text-slate-700">/api/v1/test</code>
              </div>
              <div className="p-6">
                <CodeBlock code={`curl -u sat_live_YOUR_KEY_ID:YOUR_SECRET_KEY \\
  http://localhost:5000/api/v1/test`} language="bash" id="test-api-curl" />

                <h5 className="font-semibold text-slate-800 mb-3 mt-6">Success Response</h5>
                <CodeBlock code={`{
  "success": true,
  "message": "API connection successful!",
  "user": {
    "email": "user@example.com",
    "mode": "live",
    "keyId": "sat_live_df46b3..."
  },
  "timestamp": "2026-02-24T12:00:00.000Z"
}`} language="JSON" id="test-success" />
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PayoutAPIDocumentation;
