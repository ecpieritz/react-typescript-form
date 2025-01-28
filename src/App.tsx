import React from "react";
import { CadastroProvider } from "./components/CadastroContext.tsx";
import FormularioCadastro from "./components/FormularioCadastro.tsx";
import ListaCadastros from "./components/ListaCadastros.tsx";

const App: React.FC = () => {
  return (
    <CadastroProvider>
      <div>
        <h1>Sistema de Cadastro</h1>
        <FormularioCadastro />
        <ListaCadastros />
      </div>
    </CadastroProvider>
  );
};

export default App;
