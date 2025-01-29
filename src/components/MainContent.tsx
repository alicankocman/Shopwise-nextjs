'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  discount: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface AdContent {
  image: string;
  message: string;
}

interface Props {
  searchProducts: string;
  selectedCategory: string;
  sortOption: string;
}

const adContent: AdContent[] = [
  {
    image: "https://picsum.photos/200/200?random=1",
    message: "Yeni Sezon Ürünleri Keşfedin! %50'ye Varan İndirimler"
  },
  {
    image: "https://picsum.photos/200/200?random=2",
    message: "Kış Koleksiyonu Şimdi Satışta!"
  },
  {
    image: "https://picsum.photos/200/200?random=3",
    message: "Ücretsiz Kargo Fırsatını Kaçırmayın"
  },
  {
    image: "https://picsum.photos/200/200?random=4",
    message: "Özel Fiyatlarla Sınırlı Stok"
  },
  {
    image: "https://picsum.photos/200/200?random=5",
    message: "Yılın En Büyük İndirimi Başladı"
  },
  {
    image: "https://picsum.photos/200/200?random=6",
    message: "Outlet Ürünlerde Extra %20 İndirim"
  },
];

const MainContent: React.FC<Props> = ({ searchProducts, selectedCategory, sortOption }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // ... önceki kod devam ediyor ...

  // Cart işlemleri
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((total, item) => {
    const discountedPrice = item.price * (1 - item.discount / 100);
    return total + discountedPrice * item.quantity;
  }, 0);

  // useEffect hooks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Veri alınırken bir sorun oluştu.");
        }
        return response.json();
      })
      .then((data) => {
        const productsWithDiscount = data.map((product: Product) => ({
          ...product,
          discount: Math.floor(Math.random() * 40) + 10
        }));
        setProducts(productsWithDiscount);
        setFilteredProducts(productsWithDiscount);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchProducts) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchProducts.toLowerCase()) ||
        product.description.toLowerCase().includes(searchProducts.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "Tüm Ürünler") {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }

    switch(sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        filtered.sort((a, b) => a.id - b.id);
    }

    setFilteredProducts(filtered);
  }, [searchProducts, selectedCategory, sortOption, products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchProducts, selectedCategory, sortOption]);

  // Sayfalama hesaplamaları
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

// ... önceki kod devam ediyor ...

const Pagination = () => (
  <div className="flex justify-center items-center gap-2 my-8">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-md ${
        currentPage === 1 
        ? 'bg-gray-400 cursor-not-allowed' 
        : 'bg-blue-600 hover:bg-blue-700'
      } text-white text-sm font-medium transition-colors`}
    >
      ← Önceki
    </button>

    <div className="flex gap-1">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === index + 1
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>

    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-md ${
        currentPage === totalPages 
        ? 'bg-gray-400 cursor-not-allowed' 
        : 'bg-blue-600 hover:bg-blue-700'
      } text-white text-sm font-medium transition-colors`}
    >
      Sonraki →
    </button>
  </div>
);

const AdSection = ({ side }: { side: 'left' | 'right' }) => (
  <div className={`hidden lg:flex flex-col gap-4 w-44 sticky top-5 ${
    side === 'left' ? 'mr-5' : 'ml-5'
  }`}>
    <h3 className="text-lg font-semibold text-center p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow">
      {side === 'left' ? '🔥 Günün Fırsatları' : '✨ Özel Teklifler'}
    </h3>
    {adContent.slice(side === 'left' ? 0 : 3, side === 'left' ? 3 : 6).map((ad, index) => (
      <div
        key={`${side}-ad-${index}`}
        className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer"
      >
        <div className="aspect-square mb-2">
          <Image
            src={ad.image}
            alt="Reklam"
            width={200}
            height={200}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <p className="text-sm text-gray-700 text-center leading-tight">
          {ad.message}
        </p>
      </div>
    ))}
  </div>
);

const CartComponent = () => (
  <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
    isCartOpen ? 'translate-x-0' : 'translate-x-full'
  }`}>
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-xl text-black font-semibold">Sepetim ({cart.length})</h2>
      <button
        onClick={() => setIsCartOpen(false)}
        className="text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-4">
      {cart.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Sepetiniz boş
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 border-b pb-4">
              <Image
                src={item.image}
                alt={item.title}
                width={50}
                height={50}
                className="object-contain"
              />
              <div className="flex-1">
                <h4 className="text-sm text-black font-medium">{item.title}</h4>
                <p className="text-blue-600 font-semibold">
                  ${(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-[#2563eb] text-white rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-black">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-[#2563eb] text-white rounded hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="border-t p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-black">Toplam:</span>
        <span className="font-semibold text-blue-600">${cartTotal.toFixed(2)}</span>
      </div>
      <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
        Siparişi Tamamla
      </button>
    </div>
  </div>
);

// ... önceki kod devam ediyor ...

const CartButton = () => (
  <button
    onClick={() => setIsCartOpen(true)}
    className="fixed top-10 right-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-40 transition-transform hover:scale-110"
  >
    <div className="relative">
      <span className="text-2xl">🛒</span>
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1 font-bold">
          {cart.length}
        </span>
      )}
    </div>
  </button>
);

if (isLoading) return (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-gray-600">Yükleniyor...</div>
  </div>
);

if (error) return (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-red-500">Hata: {error}</div>
  </div>
);

return (
  <div className="relative my-8">
    {/* Overlay */}
    {isCartOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsCartOpen(false)}
      />
    )}

    {/* Main Content */}
    <div className="flex justify-center max-w-[1600px] mx-auto px-4 pb-0">
      <CartButton />
      <CartComponent />
      
      {windowWidth > 768 && <AdSection side="left" />}

      <div className="flex-1 max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-0"> 
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative flex flex-col p-4"
            >
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm z-20">
                -{product.discount}%
              </div>

              {/* Product Image */}
              <div className="relative h-48 mb-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain z-10"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
                  {product.title}
                </h3>

                <div className="mt-auto">
                  <p className="text-gray-500 line-through text-sm">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-2xl font-bold text-orange-500">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-200 font-semibold"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination />
      </div>

      {windowWidth > 768 && <AdSection side="right" />}
    </div>
  </div>
);
};

export default MainContent;