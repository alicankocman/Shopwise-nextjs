import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-10 mt-12 border-t border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-5">
        {/* Hakkımızda Bölümü */}
        <div>
          <h3 className="text-blue-600 text-lg font-semibold mb-3">
            Hakkımızda
          </h3>
          <p className="text-gray-500 text-sm leading-6">
            En kaliteli ürünleri en uygun fiyatlarla sizlere sunmak için
            çalışıyoruz. Müşteri memnuniyeti bizim için her şeyden önemli.
          </p>
        </div>

        {/* Hızlı Linkler */}
        <div>
          <h3 className="text-blue-600 text-lg font-semibold mb-3">
            Hızlı Linkler
          </h3>
          <ul className="space-y-2">
            {["Anasayfa", "Ürünler", "Kampanyalar", "İletişim"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-gray-500 text-sm hover:text-blue-600 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* İletişim */}
        <div>
          <h3 className="text-blue-600 text-lg font-semibold mb-3">İletişim</h3>
          <div className="text-gray-500 text-sm space-y-2">
            <p>📍 Adres: İstanbul, Türkiye</p>
            <p>📞 Telefon: +90 (555) 123 45 67</p>
            <p>✉️ Email: info@shoppingapp.com</p>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div>
          <h3 className="text-blue-600 text-lg font-semibold mb-3">
            Bizi Takip Edin
          </h3>
          <div className="flex space-x-4">
            {["Instagram", "Facebook", "Twitter", "LinkedIn"].map((platform) => (
              <a
                key={platform}
                href="#"
                className="text-gray-500 text-sm hover:text-blue-600 transition"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Telif Hakkı */}
      <div className="text-center text-gray-500 text-sm mt-10 pt-5 border-t border-gray-200">
        © 2024 Shopping App. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default Footer;
