import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCadastroContext } from "./CadastroContext.tsx";

interface FormData {
  id?: number;
  nome: string;
  email: string;
  cep: string;
}

const FormularioCadastro: React.FC = () => {
  const { cadastroEditado, setCadastroEditado } = useCadastroContext();
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    cep: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cadastroEditado) {
      setFormData(cadastroEditado);
    }
  }, [cadastroEditado]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

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
      const response = await axios.get("http://localhost:5000/cadastros");
      const cadastros = response.data;

      const nomeDuplicado = cadastros.some(
        (cadastro: FormData) =>
          cadastro.nome === formData.nome && cadastro.id !== formData.id
      );
      const emailDuplicado = cadastros.some(
        (cadastro: FormData) =>
          cadastro.email === formData.email && cadastro.id !== formData.id
      );

      if (nomeDuplicado) {
        setError("Já existe um cadastro com este nome. Por favor, altere o nome.");
        setIsSubmitting(false);
        return;
      }

      if (emailDuplicado) {
        setError("Já existe um cadastro com este e-mail. Por favor, altere o e-mail.");
        setIsSubmitting(false);
        return;
      }

      if (formData.id) {
        await axios.put(`http://localhost:5000/cadastros/${formData.id}`, formData);
        setSuccessMessage("Cadastro atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:5000/cadastros", formData);
        setSuccessMessage("Cadastro enviado com sucesso!");
      }

      setCadastroEditado(null);
      setFormData({ nome: "", email: "", cep: "" });
    } catch (err) {
      setError("Erro ao enviar o cadastro. Tente novamente.");
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
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Validando..." : formData.id ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default FormularioCadastro;
