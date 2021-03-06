import React, { useState, useEffect } from "react";
// components
import Header from "./Header";
import SearchItem from "./SearchItem";
import AddItem from "./AddItem";
import Content from "./Content";
import Footer from "./Footer";
import apiRequest from "./apiRequest";

function App() {
  const API_URL = "http://localhost:3000/items";

  // state
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // fetch items when the component first loads
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Did not receive the expected data");
        }
        const listItems = await response.json();
        setItems(listItems);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    // if our async function returns a value , use IIFE
    // (async () => await fetchItems())(); ->   IIFE - Instantly Invoked Function Expression
    setTimeout(() => {
      fetchItems();
    }, 1000);
  }, []);

  // add item to the rest api
  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = {
      id,
      checked: false,
      item,
    };
    const listItems = [...items, myNewItem];
    setItems(listItems);

    // update the rest api
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myNewItem),
    };
    const result = await apiRequest(API_URL, postOptions);
    if (result) {
      setFetchError(result);
    }
  };

  // handle check box click
  const handleCheck = async (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);

    // update the item that is getting checked
    const myItem = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checked: myItem[0].checked }),
    };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, updateOptions);
    if (result) {
      setFetchError(result);
    }
  };

  // delete the item
  const handleDelete = async (id) => {
    const listItems = items.filter((item) => {
      return item.id !== id;
    });
    setItems(listItems);

    // deleting the item using  rest api
    const deleteOptions = { method: "DELETE" };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if (result) {
      setFetchError(result);
    }
  };

  // add an item to the rest api when form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem("");
  };

  return (
    <div className="App">
      <Header title="React Tutorial" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && (
          <Content
            items={items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>
      {!fetchError && !isLoading && <Footer length={items.length} />}
    </div>
  );
}

export default App;
