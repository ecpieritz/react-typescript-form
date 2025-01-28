import React from "react";
import "./App.scss";
import FormularioCadastro from "./components/FormularioCadastro.tsx";
import ListaCadastros from "./components/ListaCadastros.tsx";

function App() {
  return (
    <div className="App">
      <FormularioCadastro />
      <ListaCadastros />
    </div>
  );
}

export default App;
