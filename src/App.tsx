import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import About from './pages/About';
import Players from './pages/Players';
import Leaderboard from './pages/Leaderboard';
import Draws from './pages/Draws';
import Results from './pages/Results';
import PrizeMoney from './pages/PrizeMoney';
import News from './pages/News';
import Gallery from './pages/Gallery';
import Partners from './pages/Partners';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Cursor />
      <Nav />
      <ScrollToTop />
      <main key={location.pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/players" element={<Players />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/draws" element={<Draws />} />
          <Route path="/results" element={<Results />} />
          <Route path="/prize-money" element={<PrizeMoney />} />
          <Route path="/news" element={<News />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
