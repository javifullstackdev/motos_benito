import { useEffect, useState } from "react";
import apiFetch from "../api/client";
import { Link } from "react-router-dom";

type Item = {
    itemId: number;
    name: string;
    unitPrice: number;
    inStock: boolean;
};

function ItemList() {

    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        apiFetch("/api/items")
        .then((data) => setItems(data.items))
        .catch(() => setItems([]));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Artículos</h1>
          <Link to="/items/new" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Nuevo artículo</Link>
          <div className="overflow-x-auto"> 
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Artículo</th>
                  <th className="p-2">Precio</th>
                  <th className="p-2">En stock</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.itemId} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.unitPrice}</td>
                    <td className="p-2">{item.inStock ? "Sí" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    );
}

export default ItemList;