import React, { useState } from "react";
import axios from "axios";

interface FormData {
  id?: number; // ID para identificar cadastros únicos
  nome: string;
  email: string;
  cep: string;
}

interface FormularioCadastroProps {
  onCadastroSubmit: (cadastro: FormData) => void;
}

const FormularioCadastro: React.FC<FormularioCadastroProps> = ({ onCadastroSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    cep: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const checkDuplicate = async (key: "email" | "nome", value: string) => {
    try {
      const response = await axios.get("http://localhost:5000/cadastros");
      const data = response.data;
      return data.some((item: FormData) => item[key] === value && item.id !== editingId);
    } catch (err) {
      setError(`Erro ao verificar a existência do ${key}.`);
      console.error(err);
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "nome" && /[^a-zA-Z\s]/.test(value)) {
      setError("O campo Nome não deve conter números.");
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

    const emailExists = await checkDuplicate("email", formData.email);
    if (emailExists) {
      setError("Este e-mail já está cadastrado.");
      return;
    }

    const nameExists = await checkDuplicate("nome", formData.nome);
    if (nameExists) {
      setError("Este nome já está cadastrado.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        // Atualizar cadastro existente (PUT)
        const response = await axios.put(
          `http://localhost:5000/cadastros/${editingId}`,
          formData
        );

        if (response.status === 200) {
          onCadastroSubmit({ ...formData, id: editingId });
          setSuccessMessage("Cadastro atualizado com sucesso!");
        }
      } else {
        // Criar novo cadastro (POST)
        const response = await axios.post("http://localhost:5000/cadastros", formData);

        if (response.status === 201) {
          onCadastroSubmit({ ...formData, id: response.data.id });
          setSuccessMessage("Cadastro enviado com sucesso!");
        }
      }
    } catch (err) {
      setError("Erro ao enviar o cadastro. Tente novamente.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setFormData({ nome: "", email: "", cep: "" }); // Limpa o formulário
      setEditingId(null); // Sai do modo de edição
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
          {isSubmitting ? "Validando..." : editingId ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default FormularioCadastro;
