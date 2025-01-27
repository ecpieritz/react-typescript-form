// FormularioCadastro.tsx
import React, { useState } from "react";

interface FormData {
  nome: string;
  email: string;
  cep: string;
}

const FormularioCadastro: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    cep: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validação específica para o campo "nome" (não aceita números)
    if (name === "nome" && /\d/.test(value)) {
      setError("O campo Nome não pode conter números.");
      return;
    }

    // Validação específica para o campo "cep" (somente números, com máscara)
    if (name === "cep") {
      const numericValue = value.replace(/\D/g, ""); // Remove tudo que não for número
      const formattedValue = numericValue.replace(/(\d{5})(\d{1,3})/, "$1-$2"); // Aplica a máscara
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
      setError(null);
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    setError(null); // Limpa o erro ao digitar novamente
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validação de campos obrigatórios
    if (!formData.nome || !formData.email || !formData.cep) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    // Validação do CEP (somente números completos)
    if (!/^\d{5}-\d{3}$/.test(formData.cep)) {
      setError("Por favor, insira um CEP válido no formato 00000-000.");
      return;
    }

    setError(null);
    console.log("Formulário enviado com sucesso:", formData);
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            CEP:
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              maxLength={9} // Limita o tamanho do campo ao formato "00000-000"
              required
            />
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default FormularioCadastro;
