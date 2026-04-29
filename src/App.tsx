import { BrowserRouter, Route, Routes } from "react-router-dom";
import { JournalPage, JournalPostPage } from "./journalPages";
import {
  AboutPage,
  AccountPage,
  CartPage,
  CheckoutPage,
  CollectionDetailPage,
  CollectionsPage,
  ContactPage,
  HomePage,
  LegalPage,
  NotFoundPage,
  ProductPage,
  ShopPage,
} from "./pages";
import { Layout } from "./ui";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:handle" element={<CollectionDetailPage />} />
        <Route path="/products/:handle" element={<ProductPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/:slug" element={<JournalPostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/legal/:slug" element={<LegalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
