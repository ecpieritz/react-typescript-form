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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastros, setCadastros] = useState<FormData[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "nome" && /\d/.test(value)) {
      setError("O campo Nome não pode conter números.");
      return;
    }

    if (name === "cep") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue = numericValue.replace(/(\d{5})(\d{1,3})/, "$1-$2");
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
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.nome || !formData.email || !formData.cep) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    if (!/^\d{5}-\d{3}$/.test(formData.cep)) {
      setError("Por favor, insira um CEP válido no formato 00000-000.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/mockData.json`);

      if (!response.ok) {
        throw new Error("Erro ao carregar os dados.");
      }

      const data = await response.json();
      console.log("CEP encontrado:", data);

      // Simulando o envio para o arquivo JSON local
      setCadastros((prev) => [...prev, formData]);
      console.log("Formulário enviado com sucesso:", formData);
      setError(null);
    } catch (err) {
      setError("Erro ao buscar os dados do CEP.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
              maxLength={9}
              required
            />
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Validando..." : "Cadastrar"}
        </button>
      </form>
      <div>
        <h2>Cadastros Enviados</h2>
        <ul>
          {cadastros.map((item, index) => (
            <li key={index}>
              {item.nome} - {item.email} - {item.cep}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormularioCadastro;
