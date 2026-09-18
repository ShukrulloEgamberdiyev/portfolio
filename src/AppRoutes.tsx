import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import WorkIndex from './pages/WorkIndex';
import CaseStudy from './pages/CaseStudy';
import ExpertiseIndex from './pages/ExpertiseIndex';
import ExpertiseDetail from './pages/ExpertiseDetail';
import ProcessPage from './pages/ProcessPage';
import AboutPage from './pages/AboutPage';
import InsightsIndex from './pages/InsightsIndex';
import ArticlePage from './pages/ArticlePage';
import ApplyPage from './pages/ApplyPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work" element={<WorkIndex />} />
      <Route path="/work/:slug" element={<CaseStudy />} />
      <Route path="/expertise" element={<ExpertiseIndex />} />
      <Route path="/expertise/:slug" element={<ExpertiseDetail />} />
      <Route path="/process" element={<ProcessPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/insights" element={<InsightsIndex />} />
      <Route path="/insights/:slug" element={<ArticlePage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
