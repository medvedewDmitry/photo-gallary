import React, { useEffect, useState } from "react";
import Collection from "./components/Collection";
import "./index.scss";

const cats = [
  { name: "Все" },
  { name: "Море" },
  { name: "Горы" },
  { name: "Архитектура" },
  { name: "Города" },
];

function App() {
  const [categoryId, setCategoryId] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // делаем состояние для загрузчика
  // const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setIsLoading(true); // при запросе меняем состояние загрузчика на true

    const category = categoryId ? `category=${categoryId}` : "";
    
    fetch(
      // В зависимости от выбранной категории проверяем есть ли категория отличная от id=0
      // То есть не выбраны ли все категории
      // Если id категории есть, то вписываем его в URL
      // Иначе если категория не указана (id = 0), то в таком случае ничего в URL  не указывается, открывается страница со всеми категориями (т.е главная страница)
     

      `https://637db56316c1b892ebd29ec6.mockapi.io/photos?page=${page}&limit=8&${category}` // параметры для отображния количества элементов в пагинации передаем в статическом виде, так лучше не делать
    )
      .then((res) => res.json())
      .then((json) => {
        setCollections(json);
      })
      .catch((err) => {
        console.warn(err);
        alert("ошибка при получении данных");
      })
      .finally(() => setIsLoading(false)); // при любом выполнении вышестоящих промисов меняем состояние загрузчика на false
    // Подумать рендерингом категорий с сервера
    // fetch("https://637db56316c1b892ebd29ec6.mockapi.io/categories")
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setCategories(json);
    //   })
    //   .catch((err) => {
    //     console.warn(err);
    //     alert("Ошибка при получении данных о категориях");
    //   });
  }, [categoryId, page]); // передача в качестве звисимости id категории

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {/* {categories.map((obj) => (
            <li key={obj.name}>{obj.name}</li>
          ))} */}
          {cats.map((obj, i) => (
            <li
              onClick={() => setCategoryId(i)}
              className={categoryId === (i) ? "active" : ""}
              key={obj.name}
            >
              {obj.name}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          className="search-input"
          placeholder="Введите название карточки..."
        />
      </div>
      <div className="content">
        {/* Делаем проверку на включен/выключен ли загрузчик
        Если включен, то рендерим надпись загрузчика

        Если загрузчик отключается, то рендерим контент
        */}
        {isLoading ? (
          <h2>Идет загрузка...</h2>
        ) : (
          collections
            .filter((obj) =>
              obj.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((obj, index) => (
              <Collection key={index} name={obj.name} images={obj.photos} />
            ))
        )}
      </div>
      <ul className="pagination">
        {
          [...Array(3)].map((_, i) => (
            <li
              onClick={() => setPage(i + 1)}
              className={page === (i + 1) ? "active" : ""}
            >
              {i + 1}
            </li>
          )) // временный способ создать массив страниц, в реальнсти кол-во страниц передается с бекэнда
        }
      </ul>
    </div>
  );
}

export default App;
