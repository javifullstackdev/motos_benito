import { useEffect, useState } from "react";
import apiFetch from "../api/client";

type Customer = {
    customerId: number;
    type: string;
    taxId: string;
    name: string;
    phone: string;
    email: string;
    streetType: string;
    streetName: string;
    streetNumber: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
};

function CustomerList() {

    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        apiFetch("/api/customers")
        .then((data) => setCustomers(data.customers))
        .catch(() => setCustomers([]));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Clientes</h1>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Nombre</th>
                <th className="p-2">NIF/CIF</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId} className="border-b">
                  <td className="p-2">{customer.name}</td>
                  <td className="p-2">{customer.taxId}</td>
                  <td className="p-2">{customer.phone}</td>
                  <td className="p-2">{customer.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
}

export default CustomerList;