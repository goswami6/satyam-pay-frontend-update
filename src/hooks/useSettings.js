import { useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

export const useSettings = () => {
  const [settings, setSettings] = useState({
    websiteName: 'SatyamPay',
    websiteEmail: 'support@satyampay.com',
    websitePhone: '+91 1800 123 456',
    address: 'Bangalore, India',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    logo: null,
    favicon: null,
    websiteDescription: 'Everything your business needs to manage payments, finances, and delight customers.',
    metaKeywords: 'payment, gateway, fintech, transactions',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/settings/public`);
        if (response.ok) {
          const result = await response.json();
          // Handle both wrapped { success, data } and direct response formats
          const data = result.data || result;
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
