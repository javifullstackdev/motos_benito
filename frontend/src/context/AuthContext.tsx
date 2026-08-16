import { createContext, useContext, useState, useEffect } from "react";
import apiFetch from "../api/client";

type Employee = {
    emplId: number;
    firstName: string;
    lastName1: string;
    lastName2: string;
    email: string;
    active: boolean;
}

const AuthContext = createContext(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiFetch("/api/auth/me")
        .then((data) => setEmployee(data.user))
        .catch(() => setEmployee(null))
        .finally(() => setIsLoading(false));
    }, []);

    function login(employeeData: Employee) {
        setEmployee(employeeData);
    }
    
    function logout() {
        apiFetch("/api/auth/logout", { method: "POST" }).finally(() => {
            setEmployee(null);
        });
    }

    return (
        <AuthContext.Provider value={{ employee, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };