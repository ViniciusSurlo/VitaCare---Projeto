import { useState, useEffect, useContext, createContext, Children } from "react";

export const UsuarioContext = createContext();
export const UsuarioProvider = ({ children }) => {
    const [dadosUsuario, setDadosUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const usuarioLogado = localStorage.getItem("UsuarioLogado")
        if (usuarioLogado) {
            setDadosUsuario(JSON.parse(usuarioLogado))
        }
        setCarregando(false)
    }, [])
    return (
        <UsuarioContext.Provider value={{ dadosUsuario, setDadosUsuario, carregando}}>
            {children}
        </UsuarioContext.Provider>
    )
}