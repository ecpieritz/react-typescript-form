import React from "react";

const FormularioCadastro: React.FC = () => {
  return (
    <form className="registrationForm">
      <label>
        Nome:
        <input type="text" name="nome" />
      </label>
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <label>
        CEP:
        <input type="text" name="cep" />
      </label>
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default FormularioCadastro;
