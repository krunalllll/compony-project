import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)', code: 'USD' },
  INR: { symbol: '₹', rate: 85, label: 'INR (₹)', code: 'INR' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)', code: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)', code: 'GBP' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('happy_currency') || 'USD';
  });

  const setCurrency = (curr) => {
    if (CURRENCIES[curr]) {
      setCurrencyState(curr);
      localStorage.setItem('happy_currency', curr);
    }
  };

  const formatPrice = (amountInUSD) => {
    if (amountInUSD === undefined || amountInUSD === null || isNaN(amountInUSD)) {
      return '$0.00';
    }
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = amountInUSD * curr.rate;

    if (currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    } else if (currency === 'EUR') {
      return `€${converted.toFixed(2)}`;
    } else if (currency === 'GBP') {
      return `£${converted.toFixed(2)}`;
    }
    return `$${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies: CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    return {
      currency: 'USD',
      setCurrency: () => {},
      formatPrice: (amt) => `$${Number(amt || 0).toFixed(2)}`,
      currencies: CURRENCIES,
    };
  }
  return context;
};

export default CurrencyContext;
