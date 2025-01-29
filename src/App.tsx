import React from "react";
import "./App.scss";
import { CadastroProvider } from "./components/CadastroContext.tsx";
import FormularioCadastro from "./components/FormularioCadastro.tsx";
import ListaCadastros from "./components/ListaCadastros.tsx";

const App: React.FC = () => {
  return (
    <div className="App">
      <CadastroProvider>
        <div>
          <h1>Sistema de Cadastro</h1>
          <FormularioCadastro />
          <ListaCadastros />
        </div>
      </CadastroProvider>
    </div>
  );
};

export default App;
