import React, { useState } from "react";
import axios from "axios";

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

  const checkEmailExistence = async (email: string) => {
    try {
      const response = await axios.get("http://localhost:5000/cadastros");
      const data = response.data;
      return data.some((item: FormData) => item.email === email);
    } catch (err) {
      setError("Error checking email existence.");
      console.error(err);
      return false;
    }
  };

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

    // Verifica se o email já existe
    const emailExists = await checkEmailExistence(formData.email);
    if (emailExists) {
      setError("Este e-mail já está cadastrado.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Enviar o formulário para a API local
      const response = await axios.post("http://localhost:5000/cadastros", formData);

      if (response.status === 201) {
        // Atualiza a lista de cadastros
        setCadastros((prev) => [...prev, formData]);
        setError(null);
        console.log("Cadastro enviado com sucesso!");
      }
    } catch (err) {
      setError("Erro ao enviar o cadastro.");
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
