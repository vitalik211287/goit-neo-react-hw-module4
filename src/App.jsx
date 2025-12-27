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
import Loader from "components/Loader/Loader.jsx"; // краще так назвати файл
import unsplashApi from "components/api/api.js";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

const PER_PAGE = 12;

function App() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [totalPages, setTotalPages] = useState(null);

  const onSubmit = async (query) => {
    const normalized = query.trim();

    if (!normalized) {
      toast.error("Введи запит для пошуку");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      setSearchQuery(normalized);
      setPage(1);
      setImages([]);
      setTotalPages(null);

      const res = await unsplashApi.get("/search/photos", {
        params: { query: normalized, page: 1, per_page: PER_PAGE },
      });

      const results = res.data.results;
      const total = res.data.total;
      const pages = Math.ceil(total / PER_PAGE);

      setImages(results);
      setTotalPages(pages);

      if (results.length === 0) {
        toast("Нічого не знайдено 🤷‍♂️", { icon: "🔍" });
      } else {
        toast.success(`Знайдено: ${total} фото`);
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
    if (!searchQuery) return;

    // якщо вже все завантажили
    if (totalPages && page >= totalPages) {
      toast("Це всі результати ✅", { icon: "✅" });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const nextPage = page + 1;

      const res = await unsplashApi.get("/search/photos", {
        params: { query: searchQuery, page: nextPage, per_page: PER_PAGE },
      });

      const results = res.data.results;

      if (results.length === 0) {
        toast("Це всі результати ✅", { icon: "✅" });
        setTotalPages(page); // закріпили
        return;
      }

      setImages((prev) => [...prev, ...results]);
      setPage(nextPage);

      // (необов'язково) — повідомлення що догнали кінець
      if (totalPages && nextPage >= totalPages) {
        toast("Це всі результати ✅", { icon: "✅" });
      }
    } catch (err) {
      setError(err);
      toast.error("Не вдалося завантажити ще 😢");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const canLoadMore =
    images.length > 0 && (totalPages === null || page < totalPages);

  return (
    <>
      <Toaster position="top-right" />

      <SearchBar onSubmit={onSubmit} />

      {error && (
        <p style={{ textAlign: "center" }}>
          Сталася помилка запиту. Дивись console.
        </p>
      )}

      <ImageGallery images={images} />

      {canLoadMore && (
        <LoadMoreBtn onClick={loadMoreImg} disabled={isLoading} />
      )}

      {isLoading && <Loader />}
    </>
  );
}

export default App;
