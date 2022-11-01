import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = lazy(() => import('../views/Home'));
const NotFound = lazy(() => import('../views/NotFound'));
const Calculate = lazy(() => import('../views/Calculate'));
const Cities = lazy(() => import('../views/Cities'));
const Details = lazy(() => import('../views/Details'));

const RoutesHOC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/NotFound" element={<NotFound />} />
        <Route path="/calculate" element={<Calculate />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/details" element={<Details />} />
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Navigate to="/NotFound" replace />} />
      </Routes>
    </Layout>
  );
}

export default RoutesHOC;
