import { Route, Routes } from 'react-router';
import Layout from '../components/layout/Layout';
import CatalogPage from '../pages/CatalogPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}