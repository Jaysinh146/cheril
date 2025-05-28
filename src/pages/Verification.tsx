import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, Upload, FileText, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Verification = () => {
  const [idType, setIdType] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type (PDF only)
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF document only.',
          variant: 'destructive',
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setIdDocument(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to verify your account.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    if (!idType || !idNumber || !idDocument) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields and upload your ID document.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      // Upload document to storage
      const fileExt = idDocument.name.split('.').pop();
      const fileName = `${user.id}_verification_${Date.now()}.${fileExt}`;
      const filePath = `verification/${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification_docs')
        .upload(filePath, idDocument);
        
      if (uploadError) throw uploadError;
      
      // Since 'verifications' table might not exist yet, we'll store verification data in a new bucket
      // instead of creating a dedicated table for now
      
      // Create metadata JSON for verification
      const verificationMetadata = {
        user_id: user.id,
        id_type: idType,
        id_number: idNumber,
        status: 'pending',
        submitted_at: new Date().toISOString()
      };
      
      // Upload metadata alongside the document
      const metadataPath = `verification/${user.id}/metadata.json`;
      const { error: metadataError } = await supabase.storage
        .from('verification_docs')
        .upload(metadataPath, JSON.stringify(verificationMetadata), {
          contentType: 'application/json',
          upsert: true
        });
        
      if (metadataError) throw metadataError;
      
      // Store verification status directly in the profiles table using existing fields
      // We'll use the 'avatar_url' field to store a special string indicating pending verification
      // This is a temporary workaround until the database schema is updated
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          // Store verification status in a profile field that actually exists
          // This will be replaced with a proper schema update later
          phone: `PENDING_VERIFICATION:${idType}`
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: 'Verification submitted successfully',
        description: 'Your verification request has been submitted and is pending review.',
      });
      
      // Redirect to profile page
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error submitting verification:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to submit verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#181A2A] mb-3">
              Seller Verification
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Verify your identity to become a trusted seller on our platform. Verified sellers receive a blue checkmark and priority in search results.
            </p>
          </div>
          
          <Card className="shadow-md border-0">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
                <div>
                  <CardTitle className="text-xl text-blue-700">Verification Process</CardTitle>
                  <CardDescription className="text-blue-600">
                    Upload your government-issued ID to verify your account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="id-type">ID Type</Label>
                    <Select
                      value={idType}
                      onValueChange={setIdType}
                      required
                    >
                      <SelectTrigger id="id-type" className="w-full">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="driving-license">Driving License</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="voter-id">Voter ID</SelectItem>
                        <SelectItem value="pan-card">PAN Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="id-number">ID Number</Label>
                    <Input
                      id="id-number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="Enter your ID number"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Your ID number will be kept private and secure
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="id-document">Upload ID Document (PDF only)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        id="id-document"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                      <label htmlFor="id-document" className="cursor-pointer">
                        {idDocument ? (
                          <div className="flex flex-col items-center">
                            <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-700 mb-1">{idDocument.name}</p>
                            <p className="text-sm text-gray-500">{(idDocument.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-700 mb-2">Upload ID Document</p>
                            <p className="text-sm text-gray-500">Drag and drop or click to select PDF file</p>
                            <p className="text-xs text-gray-400 mt-2">Maximum file size: 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  {isSubmitting && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Uploading...</span>
                        <span className="text-sm text-gray-500">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      Benefits of Verification
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="ml-2 text-gray-600">Verified seller badge on your profile and listings</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="ml-2 text-gray-600">Priority placement in search results</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="ml-2 text-gray-600">Higher trust from potential renters</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <CardFooter className="px-0 pt-6 pb-0 mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => navigate('/profile')}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isSubmitting || !idType || !idNumber || !idDocument}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Submit for Verification
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Verification;
