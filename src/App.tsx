import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import CitySelect from "./pages/CitySelect";
import Index from "./pages/Index";
import ShanghaiIndex from "./pages/ShanghaiIndex";
import ChengduIndex from "./pages/ChengduIndex";
import NotFound from "./pages/NotFound";
import { ImportData } from "./pages/ImportData";
import DataAdmin from "./pages/DataAdmin";
import DataAdminLogin from "./pages/DataAdminLogin";
import ShanghaiDataAdmin from "./pages/ShanghaiDataAdmin";
import ShanghaiDataAdminLogin from "./pages/ShanghaiDataAdminLogin";
import ChengduDataAdmin from "./pages/ChengduDataAdmin";
import ChengduDataAdminLogin from "./pages/ChengduDataAdminLogin";
import { isAdminAuthenticated } from "./lib/adminAuth";

const queryClient = new QueryClient();

const AdminProtectedRoute = ({
  children,
  loginPath,
}: {
  children: JSX.Element;
  loginPath: string;
}) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to={loginPath} replace />;
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
          <Route path="/" element={<CitySelect />} />
          <Route path="/beijing" element={<Index />} />
          <Route path="/shanghai" element={<ShanghaiIndex />} />
          <Route path="/chengdu" element={<ChengduIndex />} />
          <Route path="/import-data" element={<ImportData />} />
          <Route path="/data-admin-login" element={<DataAdminLogin />} />
          <Route
            path="/data-admin"
            element={
              <AdminProtectedRoute loginPath="/data-admin-login">
                <DataAdmin />
              </AdminProtectedRoute>
            }
          />
          <Route path="/shanghai/data-admin-login" element={<ShanghaiDataAdminLogin />} />
          <Route
            path="/shanghai/data-admin"
            element={
              <AdminProtectedRoute loginPath="/shanghai/data-admin-login">
                <ShanghaiDataAdmin />
              </AdminProtectedRoute>
            }
          />
          <Route path="/chengdu/data-admin-login" element={<ChengduDataAdminLogin />} />
          <Route
            path="/chengdu/data-admin"
            element={
              <AdminProtectedRoute loginPath="/chengdu/data-admin-login">
                <ChengduDataAdmin />
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
