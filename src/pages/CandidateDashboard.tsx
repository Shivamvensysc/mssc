import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/interceptor';
import ShowallDeatilsPage from '../components/ShowallDeatilsPage';
import { Loader2 } from 'lucide-react';

export default function CandidateDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<any>(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get(`${BASE_URL}/application/steps/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const data = response.data.data;
          
          // Check if the application is fully submitted
          if (data.isSubmitted === true && data.status === 'submitted') {
            setApplicationData(data); // Store data to show the details page
          } else {
            // If NOT submitted, automatically redirect them to fill the form
            navigate('/candidate/application', { replace: true });
          }
        }
      } catch (error) {
        console.error('Failed to fetch application data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationData();
  }, [navigate, BASE_URL]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-[#0076b6]" size={48} />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Render the final details page if the user has completed everything
  if (applicationData) {
    return <ShowallDeatilsPage applicationData={applicationData} />;
  }

  return null;
}