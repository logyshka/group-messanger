import React from 'react';
import './App.css';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import ChatPage from './components/chat/ChatPage';
import 'bootstrap/dist/css/bootstrap.min.css';


// Main App component
function App() {
    return (
        <AuthProvider>
            <AppContent/>
        </AuthProvider>
    );
}

// App content that uses the auth context
function AppContent() {
    const {currentUser} = useAuth();

    return (
        <div className="App">
            {currentUser ? <ChatPage/> : <AuthPage/>}
        </div>
    );
}

export default App;
