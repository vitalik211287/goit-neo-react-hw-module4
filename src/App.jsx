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
  if (!normalized) return;

  try {
    setIsLoading(true);
    setError(null);

    setSearchQuery(normalized);
    setPage(1);
    setImages([]);
    setTotalResults(0);

    const res = await unsplashApi.get("/search/photos", {
      params: { query: normalized, page: 1, per_page: PER_PAGE },
    });
setTotalPages(Math.ceil(res.data.total / PER_PAGE));
    setImages(res.data.results);
    setTotalResults(res.data.total);
  } catch (err) {
    setError(err);
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};


  const loadMoreImg = async () => {
    if (!searchQuery) return;

    try {
      setIsLoading(true);
      setError(null);

      const nextPage = page + 1;

      const res = await unsplashApi.get("/search/photos", {
        params: { query: searchQuery, page: nextPage, per_page: PER_PAGE },
      });

      setImages((prev) => [...prev, ...res.data.results]);
      setPage(nextPage);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {console.log(totalResults)}
      <SearchBar onSubmit={onSubmit} />
      {error && (
        <p style={{ textAlign: "center" }}>
          Сталася помилка запиту. Дивись console.
        </p>
      )}
      <ImageGallery images={images} onImageClick={openModal} />
      {images.length > 0 && page < totalPages && (
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
