import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Impact from './components/Impact';
import Adoption from './components/Adoption';
import Testimonials from './components/Testimonials';
import Partners from './components/Partners';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdoptionPage from './pages/AdoptionPage';
import NgoDashboard from './pages/NgoDashboard';
import './App.css';

// https://console.cloud.google.com/ → APIs & Services → Credentials
const GOOGLE_CLIENT_ID = '1052124629788-9ssci4d9cpggjgjsima939riiubdkger.apps.googleusercontent.com';

const LandingPage = () => (
  <div className="app">
    <Navbar />
    <Hero />
    <About />
    <Features />
    <HowItWorks />
    <Impact />
    <Stats />
    <Adoption />
    <Testimonials />
    <Partners />
    <CTA />
    <Footer />
  </div>
);

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/adopt" element={<AdoptionPage />} />
          <Route path="/ngo-dashboard" element={<NgoDashboard />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
