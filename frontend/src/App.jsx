import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import { TrackingProvider } from './context/TrackingContext';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user || !user.isAdmin) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <TrackingProvider>
        <div className="app-shell">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <div className="homepage-hero">
                    <h1>Discover Our Premium Collection</h1>
                    <p>Quality products curated just for you.</p>
                  </div>
                  <ProductsPage />
                </ProtectedRoute>
              } />

              <Route path="/products" element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              } />

              <Route path="/products/:id" element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              } />

              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Routes>
          </main>
        </div>
      </TrackingProvider>
    </Router>
  );
}

export default App;
