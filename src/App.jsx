// import React from "react";
// import SearchBar from "components/SearchBar/SearchBar.jsx";
// import ImageGallery from "components/ImageGallery/ImageGallery.jsx";
// import LoadMoreBtn from "components/LoadMoreBtn/LoadMoreBtn.jsx";
// import { useState } from "react";
// import { unsplashApi } from "components/api/api";
// import "./App.css";

// function App() {
//   const onSubmit = async (query) => {
//     try {
//       setSearchQuery(query); // запам’ятали що шукаємо

//       const res = await unsplashApi.get("/search/photos", {
//         params: { query, page: 1, per_page: 12 },
//       });

//       setImages(res.data.results); // ← ОЦЕ КЛЮЧОВЕ
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const loadMoreImg = async () => {
//     // setSearchQuery("");
//     try {
//       const nextPage = Math.floor(images.length / 12) + 1;

//       const res = await unsplashApi.get("/search/photos", {
//         params: { query: searchQuery, page: nextPage, per_page: 12 },
//       });

//       setImages((prevImages) => [...prevImages, ...res.data.results]);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   const [images, setImages] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   console.log(images);

//   return (
//     <>
//       <SearchBar
//         onSubmit={onSubmit}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//       />
//       <ImageGallery images={images} />
//       <>{images.length > 0 && <LoadMoreBtn loadMoreImg={loadMoreImg} />}</>
//     </>
//   );
// }

// export default App;

import { useState } from "react";
import SearchBar from "components/SearchBar/SearchBar.jsx";
import ImageGallery from "components/ImageGallery/ImageGallery.jsx";
import LoadMoreBtn from "components/LoadMoreBtn/LoadMoreBtn.jsx";
import Loader from "components/Loader/Loader.jsx";
import ImageModal from "components/ImageModal/ImageModal.jsx";
import unsplashApi from "components/api/api.js";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

const PER_PAGE = 12;

function App() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const onSubmit = async (query) => {
    const normalized = query.trim();

    if (!normalized) {
      toast.error("Введи запит для пошуку");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // скидання попереднього пошуку
      setSearchQuery(normalized);
      setPage(1);
      setImages([]);
      setTotalResults(0);
      setTotalPages(0);

      // прибираємо старі тости типу "це всі результати"
      toast.dismiss("end");

      const res = await unsplashApi.get("/search/photos", {
        params: { query: normalized, page: 1, per_page: PER_PAGE },
      });

      const results = res.data.results || [];
      const total = res.data.total || 0;
      const pages = Math.ceil(total / PER_PAGE);

      setImages(results);
      setTotalResults(total);
      setTotalPages(pages);

      if (results.length === 0) {
        toast("Нічого не знайдено 🤷‍♂️", { icon: "🔍" });
        return;
      }

      toast.success(`Знайдено ${total} фото`);

      // якщо все влізло на першу сторінку — одразу кажемо, що це всі результати
      if (pages <= 1) {
        toast("Це всі результати ✅", { id: "end", icon: "✅" });
      }
    } catch (err) {
      setError(err);
      toast.error("Помилка запиту 😢");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreImg = async () => {
    if (!searchQuery) {
      toast.error("Спочатку введи запит для пошуку");
      return;
    }

    if (page >= totalPages) {
      toast("Це всі результати ✅", { id: "end", icon: "✅" });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const nextPage = page + 1;

      const res = await unsplashApi.get("/search/photos", {
        params: { query: searchQuery, page: nextPage, per_page: PER_PAGE },
      });

      const results = res.data.results || [];

      if (results.length === 0) {
        // на випадок, якщо API повернув порожньо — ховаємо кнопку і показуємо тост
        setTotalPages(page);
        toast("Це всі результати ✅", { id: "end", icon: "✅" });
        return;
      }

      setImages((prev) => [...prev, ...results]);
      setPage(nextPage);

      // якщо дійшли до останньої сторінки — показати один раз
      if (nextPage >= totalPages) {
        toast("Це всі результати ✅", { id: "end", icon: "✅" });
      }
    } catch (err) {
      setError(err);
      toast.error("Не вдалося завантажити ще 😢");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const canLoadMore = images.length > 0 && page < totalPages;

  return (
    <>
      <Toaster position="top-right" />

      <SearchBar onSubmit={onSubmit} />

      {error && (
        <p style={{ textAlign: "center" }}>
          Сталася помилка запиту. Дивись console.
        </p>
      )}

      <ImageGallery images={images} onImageClick={openModal} />

      {canLoadMore && (
        <LoadMoreBtn onClick={loadMoreImg} disabled={isLoading} />
      )}

      {isLoading && <Loader />}

      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        image={selectedImage}
      />
    </>
  );
}

export default App;

