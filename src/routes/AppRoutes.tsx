import { Route, Routes } from 'react-router';
import Layout from '../components/layout/Layout';
import CatalogPage from '../pages/CatalogPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProductPage from '../pages/ProductPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="products/:id" element={<ProductPage />} />
      </Route>
    </Routes>
  );
}