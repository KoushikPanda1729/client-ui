import { productServiceServer } from "@/services/product.service.server";
import { categoryServiceServer } from "@/services/category.service.server";
import { toppingServiceServer } from "@/services/topping.service.server";
import HeroSection from "@/components/home/HeroSection";
import Footer from "@/components/layout/Footer";
import ClientPageWrapper from "@/components/ClientPageWrapper";

/**
 * Server Component - Home Page
 * Most of the page is server-rendered for better SEO and performance
 * Only interactive parts (navbar, catalog, modal, cart) are client components
 */
export default async function Home() {
  // Fetch initial data on server (cookies automatically forwarded)
  const [productsResponse, categoriesResponse, toppingsResponse] = await Promise.all([
    productServiceServer.getProducts(1, 10).catch(() => ({ data: [], total: 0 })),
    categoryServiceServer.getCategories(1, 50).catch(() => ({ data: [], total: 0 })),
    toppingServiceServer.getToppings(1, 50).catch(() => ({ data: [], total: 0 })),
  ]);

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Client wrapper includes Navbar and ProductCatalog */}
      <ClientPageWrapper
        initialProducts={productsResponse.data}
        initialCategories={categoriesResponse.data}
        initialToppings={toppingsResponse.data}
      />

      {/* Footer - Server Component */}
      <Footer />
    </div>
  );
}
