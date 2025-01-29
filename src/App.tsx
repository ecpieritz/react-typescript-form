import React, { useState } from "react";
import './App.scss';
import { CadastroProvider } from "./components/CadastroContext.tsx";
import ListaCadastros from "./components/ListaCadastros.tsx";
import FormularioCadastro from "./components/FormularioCadastro.tsx";

const App: React.FC = () => {
  const [cadastroEditado, setCadastroEditado] = useState<any | null>(null);

  return (
    <div className="App">
      <CadastroProvider>
        <FormularioCadastro cadastroEditado={cadastroEditado} onEditComplete={() => setCadastroEditado(null)} />
        <ListaCadastros onEdit={setCadastroEditado} />
      </CadastroProvider>
    </div>
  );
};

export default App;
