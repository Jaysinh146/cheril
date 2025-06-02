import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        
        // Check for any error from the OAuth provider
        const errorDescription = searchParams.get('error_description');
        if (errorDescription) {
          throw new Error(errorDescription);
        }

        // Check for email confirmation
        const type = searchParams.get('type');
        if (type === 'email_confirm') {
          setEmailConfirmed(true);
          setIsLoading(false);
          return;
        }

        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          throw error || new Error('No session found');
        }

        // Store the user data in localStorage for persistence
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: session,
          expiresAt: session.expires_at
        }));

        // Redirect to the dashboard or home page
        navigate('/browse');
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (emailConfirmed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Your email is confirmed!</h2>
          <p className="mb-6">Thank you for confirming your email address. You can now continue using Cheril.</p>
          <Button onClick={() => navigate('/browse')} className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-6 py-2 rounded-full font-medium">Go to Browse</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7996E] mx-auto mb-4"></div>
          <p className="text-gray-600">Signing you in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => navigate('/auth')} 
            className="bg-[#F7996E] hover:bg-[#e68a60] w-full"
          >
            Return to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
