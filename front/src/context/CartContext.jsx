import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "guestCart";

function normalizeItem(item) {
  const id = item?.id ?? item?.id_plant;

  if (id === undefined || id === null) {
    return null;
  }

  return {
    id,
    name: item.name ?? "Неизвестное растение",
    price: Number(item.price ?? 0),
    img: item.img ?? item.url_link ?? "/img/placeholder.jpg",
    qty: Math.max(1, Number(item.qty ?? item.count_plant ?? 1)),
  };
}

function readGuestCart() {
  try {
    // Корзина авторизованного пользователя должна загружаться с сервера.
    if (localStorage.getItem("JWTtoken")) {
      return [];
    }
    const savedCart = localStorage.getItem(STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.map(normalizeItem).filter(Boolean);
  } catch (error) {
    console.error("Не удалось прочитать гостевую корзину:", error);
    return [];
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readGuestCart);

  // Гостевая корзина сохраняется. После появления JWT данные хранятся на сервере.
  useEffect(() => {
    try {
      if (localStorage.getItem("JWTtoken")) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Не удалось сохранить корзину:", error);
    }
  }, [items]);

  const addToCart = useCallback(async (product) => {
    const normalizedProduct = normalizeItem({ ...product, qty: 1 });

    if (!normalizedProduct) {
      console.error("Нельзя добавить товар без id:", product);
      return;
    }

    // Для авторизованного пользователя сразу записываем товар в БД.
    // Для гостя просто обновляем состояние, которое сохраняется в localStorage.
    const token = localStorage.getItem("JWTtoken");
    let id_user = null;

    if (token) {
      try {
        const payload = jwtDecode(token);
        id_user = payload?.id_user ?? payload?.id ?? null;
      } catch (error) {
        console.error("Не удалось прочитать JWT:", error);
      }
    }

    if (id_user !== null) {
      try {
        const response = await fetch("/api/update_user_basket", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_user,
            id_plant: normalizedProduct.id,
            delta: 1,
          }),
        });

        let responseData = {};
        try {
          responseData = await response.json();
        } catch {
          responseData = {};
        }

        if (!response.ok || responseData.isValidation === false) {
          throw new Error(
            responseData.message || "Не удалось добавить товар в корзину",
          );
        }
      } catch (error) {
        console.error("Ошибка добавления товара в корзину:", error);
        return;
      }
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => String(item.id) === String(normalizedProduct.id),
      );

      if (existingItem) {
        return prevItems.map((item) =>
          String(item.id) === String(normalizedProduct.id)
            ? { ...item, qty: item.qty + 1 }
            : item,
        );
      }

      return [...prevItems, normalizedProduct];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems((prevItems) =>
      prevItems.filter((item) => String(item.id) !== String(id)),
    );
  }, []);

  const changeQty = useCallback((id, delta) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          String(item.id) === String(id)
            ? { ...item, qty: item.qty + delta }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const replaceCart = useCallback((newItems) => {
    const normalizedItems = Array.isArray(newItems)
      ? newItems.map(normalizeItem).filter(Boolean)
      : [];

    setItems(normalizedItems);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Не удалось очистить сохранённую корзину:", error);
    }
  }, []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.qty * Number(item.price || 0), 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      changeQty,
      replaceCart,
      clearCart,
      totalCount,
      totalPrice,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      changeQty,
      replaceCart,
      clearCart,
      totalCount,
      totalPrice,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart должен использоваться внутри CartProvider");
  }

  return context;
};
