import React, { createContext, useContext, useState } from "react";

interface Cadastro {
  id: number;
  nome: string;
  email: string;
  cep: string;
}

interface CadastroContextType {
  cadastroEditado: Cadastro | null;
  setCadastroEditado: (cadastro: Cadastro | null) => void;
  atualizarLista: () => void;
}

const CadastroContext = createContext<CadastroContextType | undefined>(undefined);

export const CadastroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cadastroEditado, setCadastroEditado] = useState<Cadastro | null>(null);
  
  // Callback para atualizar a lista de cadastros
  const atualizarLista = () => {
    setCadastroEditado(null); // Caso queira resetar o formulário após a atualização
  };

  return (
    <CadastroContext.Provider value={{ cadastroEditado, setCadastroEditado, atualizarLista }}>
      {children}
    </CadastroContext.Provider>
  );
};

export const useCadastroContext = () => {
  const context = useContext(CadastroContext);
  if (!context) {
    throw new Error("useCadastroContext deve ser usado dentro de CadastroProvider");
  }
  return context;
};
