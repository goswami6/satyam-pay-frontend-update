import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Upload, CreditCard, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { kycAPI } from '../../utils/api';

const KYCVerification = () => {
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    aadharNumber: '',
    panNumber: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
  });

  const [files, setFiles] = useState({
    aadharFront: null,
    aadharBack: null,
    panImage: null,
  });

  const [previews, setPreviews] = useState({
    aadharFront: null,
    aadharBack: null,
    panImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFiles(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
      setError('');
    }
  };

  const validateStep1 = () => {
    if (!formData.aadharNumber || formData.aadharNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhar number');
      return false;
    }
    if (!files.aadharFront) {
      setError('Please upload Aadhar front image');
      return false;
    }
    if (!files.aadharBack) {
      setError('Please upload Aadhar back image');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.panNumber || formData.panNumber.length !== 10) {
      setError('Please enter a valid 10-character PAN number');
      return false;
    }
    if (!files.panImage) {
      setError('Please upload PAN card image');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.accountNumber) {
      setError('Please enter account number');
      return false;
    }
    if (!formData.ifscCode) {
      setError('Please enter IFSC code');
      return false;
    }
    if (!formData.bankName) {
      setError('Please enter bank name');
      return false;
    }
    if (!formData.accountHolderName) {
      setError('Please enter account holder name');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(prev => prev + 1);
    setError('');
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('aadharNumber', formData.aadharNumber);
      data.append('panNumber', formData.panNumber);
      data.append('accountNumber', formData.accountNumber);
      data.append('ifscCode', formData.ifscCode);
      data.append('bankName', formData.bankName);
      data.append('accountHolderName', formData.accountHolderName);
      data.append('aadharFront', files.aadharFront);
      data.append('aadharBack', files.aadharBack);
      data.append('panImage', files.panImage);

      const response = await kycAPI.submit(user._id, data);

      setSuccess('KYC submitted successfully! Redirecting...');
      updateUser({ kyc: response.data.user.kyc });

      // Reload to show pending page
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit KYC');
    } finally {
      setIsLoading(false);
    }
  };

  const FileUploadBox = ({ name, label, preview }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label} *</label>
      <div className="relative">
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id={name}
        />
        <label
          htmlFor={name}
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${preview ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-indigo-400 bg-gray-50'
            }`}
        >
          {preview ? (
            <img src={preview} alt={label} className="h-full w-full object-contain rounded-xl p-2" />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <Upload size={32} className="mb-2" />
              <span className="text-sm">Click to upload</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your KYC</h1>
          <p className="text-gray-500 mt-2">Please verify your identity to access all features</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-500'
                }`}>
                {currentStep > step ? <CheckCircle size={20} /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between mb-8 px-4">
          <span className={`text-sm ${currentStep >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>Aadhar</span>
          <span className={`text-sm ${currentStep >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>PAN Card</span>
          <span className={`text-sm ${currentStep >= 3 ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>Bank Details</span>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle size={20} />
            {success}
          </div>
        )}

        {/* Step 1: Aadhar Card */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-indigo-600" size={24} />
              <h2 className="text-xl font-semibold">Aadhar Card Details</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number *</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                maxLength={12}
                placeholder="Enter 12-digit Aadhar number"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadBox name="aadharFront" label="Aadhar Front" preview={previews.aadharFront} />
              <FileUploadBox name="aadharBack" label="Aadhar Back" preview={previews.aadharBack} />
            </div>
          </div>
        )}

        {/* Step 2: PAN Card */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-indigo-600" size={24} />
              <h2 className="text-xl font-semibold">PAN Card Details</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number *</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                maxLength={10}
                placeholder="Enter 10-character PAN number"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
              />
            </div>

            <FileUploadBox name="panImage" label="PAN Card Image" preview={previews.panImage} />
          </div>
        )}

        {/* Step 3: Bank Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-indigo-600" size={24} />
              <h2 className="text-xl font-semibold">Bank Account Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  placeholder="Enter account holder name"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter account number"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  placeholder="Enter IFSC code"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="Enter bank name"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg text-white font-semibold transition ${isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              {isLoading ? 'Submitting...' : 'Submit KYC'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
