import { useState } from "react";
import SearchBar from "Components/SearchBar/SearchBar.jsx";
import ImageGallery from "Components/ImageGallery/ImageGallery.jsx";
import LoadMoreBtn from "Components/LoadMoreBtn/LoadMoreBtn.jsx";
import Loader from "Components/Loader/loader.jsx";
import ImageModal from "Components/ImageModal/imageModal.jsx";
import unsplashApi from "Components/api/api.js";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

const PER_PAGE = 12;

function App() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

      // скидання попереднього пошуку
      setSearchQuery(normalized);
      setPage(1);
      setImages([]);
      setTotalPages(0);

      toast.dismiss("end");

      const res = await unsplashApi.get("/search/photos", {
        params: { query: normalized, page: 1, per_page: PER_PAGE },
      });

      const results = res.data.results || [];
      const total = res.data.total || 0;
      const pages = Math.ceil(total / PER_PAGE);

      setImages(results);
      setTotalPages(pages);

      if (results.length === 0) {
        toast("Нічого не знайдено 🤷‍♂️", { icon: "🔍" });
        return;
      }

      // якщо все влізло на першу сторінку — одразу кажемо, що це всі результати
      if (pages <= 1) {
        toast("Це всі результати ✅", { id: "end", icon: "✅" });
      }
    } catch (err) {
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
