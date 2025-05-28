
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Product from "./pages/Product";
import ListItem from "./pages/ListItem";
import EditItem from "./pages/EditItem";
import Auth from "./pages/Auth";
import HowItWorks from "./pages/HowItWorks";
import Waitlist from "./pages/Waitlist";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Verification from "./pages/Verification";
import Wishlist from "./pages/Wishlist";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Protected route component that redirects logged-in users away from the landing page
const ProtectedIndex = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/browse" replace /> : <Index />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedIndex />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/list-item" element={<ListItem />} />
            <Route path="/edit-item/:id" element={<EditItem />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
