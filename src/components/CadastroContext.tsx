import React, { createContext, useContext, useState } from "react";

interface Cadastro {
  id?: number;
  nome: string;
  email: string;
  cep: string;
}

interface CadastroContextType {
  cadastroEditado: Cadastro | null;
  setCadastroEditado: (cadastro: Cadastro | null) => void;
}

export const CadastroContext = createContext<CadastroContextType | undefined>(
  undefined
);

export const CadastroProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cadastroEditado, setCadastroEditado] = useState<Cadastro | null>(null);

  return (
    <CadastroContext.Provider value={{ cadastroEditado, setCadastroEditado }}>
      {children}
    </CadastroContext.Provider>
  );
};

export const useCadastroContext = () => {
  const context = useContext(CadastroContext);
  if (!context) {
    throw new Error(
      "useCadastroContext deve ser usado dentro de um CadastroProvider"
    );
  }
  return context;
};
