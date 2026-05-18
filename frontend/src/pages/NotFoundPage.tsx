import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4">
      <div className="text-center animate-fade-in">
        <p className="text-8xl font-bold text-[#2a3347] mb-4">404</p>
        <h1 className="text-2xl font-bold text-[#e8edf5] mb-2">Page not found</h1>
        <p className="text-sm text-[#8a97b0] mb-8">The page you're looking for doesn't exist.</p>
        <Button icon={<Home size={15} />} onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
