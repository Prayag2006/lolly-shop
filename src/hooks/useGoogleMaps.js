import { useState, useEffect } from 'react';

const useGoogleMaps = (apiKey) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    if (!apiKey) {
      console.warn('Google Maps API key is missing');
      return;
    }

    const scriptId = 'google-maps-script';
    
    // Check if script is already added
    if (document.getElementById(scriptId)) {
      // If it exists but not loaded yet, wait for it
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);

    return () => {
      // We don't remove the script on unmount to allow caching between page views
    };
  }, [apiKey]);

  return { isLoaded, error };
};

export default useGoogleMaps;
