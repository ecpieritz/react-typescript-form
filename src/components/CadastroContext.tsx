import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Cadastro {
  id?: number;
  nome: string;
  email: string;
  cep: string;
}

interface CadastroContextType {
  cadastros: Cadastro[];
  atualizarCadastros: () => void;
}

const CadastroContext = createContext<CadastroContextType | undefined>(undefined);

export const CadastroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);

  const atualizarCadastros = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cadastros");
      setCadastros(response.data);
    } catch (error) {
      console.error("Erro ao buscar cadastros:", error);
    }
  };

  useEffect(() => {
    atualizarCadastros();
  }, []);

  return (
    <CadastroContext.Provider value={{ cadastros, atualizarCadastros }}>
      {children}
    </CadastroContext.Provider>
  );
};

export const useCadastroContext = () => {
  const context = useContext(CadastroContext);
  if (!context) {
    throw new Error("useCadastroContext deve ser usado dentro de um CadastroProvider");
  }
  return context;
};
