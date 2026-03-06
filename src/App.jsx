import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SupportChatProvider } from './context/SupportChatContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SupportChatProvider>
            <AppRoutes />
          </SupportChatProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
