import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ImportData } from "./pages/ImportData";
import DataAdmin from "./pages/DataAdmin";
import DataAdminLogin from "./pages/DataAdminLogin";
import { isAdminAuthenticated } from "./lib/adminAuth";

const queryClient = new QueryClient();

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/data-admin-login" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/import-data" element={<ImportData />} />
          <Route path="/data-admin-login" element={<DataAdminLogin />} />
          <Route path="/data-admin" element={<AdminProtectedRoute><DataAdmin /></AdminProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
