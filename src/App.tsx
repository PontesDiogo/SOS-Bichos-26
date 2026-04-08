import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);

  const [modo, setModo] = useState<"login" | "cadastro">("login");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [anonimo, setAnonimo] = useState(false);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const role = user?.user_metadata?.role || "user";

  const statusOptions = [
    "Pendente",
    "Em análise",
    "Em atendimento",
    "Resolvido",
    "Cancelado",
  ];

  const validarEmail = (valor: string) => {
    return valor.includes("@") && valor.includes(".");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "#fff3cd";
      case "Em análise":
        return "#d1ecf1";
      case "Em atendimento":
        return "#cce5ff";
      case "Resolvido":
        return "#d4edda";
      case "Cancelado":
        return "#f8d7da";
      default:
        return "#f5f5f5";
    }
  };

  const handleSignup = async () => {
    if (!nome.trim()) {
      alert("Informe seu nome");
      return;
    }

    if (!validarEmail(email)) {
      alert("Email inválido");
      return;
    }

    if (!password.trim()) {
      alert("Informe uma senha");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          role: "user",
        },
      },
    });

    alert(error ? error.message : "Conta criada!");
  };

  const handleLogin = async () => {
    if (!validarEmail(email)) {
      alert("Email inválido");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        alert("Usuário não cadastrado ou senha incorreta");
      } else {
        alert(error.message);
      }
      return;
    }

    alert("Logado!");
    await getUser();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDenuncias([]);
    setMostrarTodos(false);
    setMostrarForm(false);
  };

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  const carregarDenuncias = async () => {
    if (!user) return;

    let query = supabase.from("denuncias").select("*");

    if (role === "user") {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Erro ao carregar denúncias:", error.message);
      return;
    }

    setDenuncias(data || []);
  };

  const criarDenuncia = async () => {
    if (!user) {
      alert("Faça login primeiro");
      return;
    }

    if (!titulo.trim() || !descricao.trim() || !endereco.trim()) {
      alert("Preencha título, descrição e endereço");
      return;
    }

    const nomeAutor = anonimo
      ? "Anônimo"
      : user?.user_metadata?.nome || user?.email || "Usuário";

    const { error } = await supabase.from("denuncias").insert([
      {
        titulo,
        descricao,
        endereco,
        user_id: user.id,
        nome_usuario: nomeAutor,
        anonimo,
        status: "Pendente",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Denúncia criada!");
    setTitulo("");
    setDescricao("");
    setEndereco("");
    setAnonimo(false);
    setMostrarForm(false);
    carregarDenuncias();
  };

  const atualizarStatus = async (id: string, novoStatus: string) => {
    const { error } = await supabase
      .from("denuncias")
      .update({ status: novoStatus })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar status: " + error.message);
      return;
    }

    carregarDenuncias();
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      carregarDenuncias();
    }
  }, [user]);

  const denunciasExibidas =
    role === "user" && !mostrarTodos ? denuncias.slice(0, 1) : denuncias;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>SOS Bichos 🐾</h1>

      {!user ? (
        <>
          {modo === "login" ? (
            <>
              <h2>Login</h2>

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />

              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />

              <button onClick={handleLogin}>Entrar</button>

              <p>
                Não tem conta?{" "}
                <button onClick={() => setModo("cadastro")}>Cadastrar</button>
              </p>
            </>
          ) : (
            <>
              <h2>Cadastro</h2>

              <input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />

              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />

              <button onClick={handleSignup}>Cadastrar</button>

              <p>
                Já tem conta?{" "}
                <button onClick={() => setModo("login")}>Login</button>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <h2>Bem-vindo, {user?.user_metadata?.nome || user?.email} 👋</h2>
          <p>
            <strong>Perfil:</strong> {role}
          </p>

          <button onClick={handleLogout}>Sair</button>

          {role === "user" && (
            <div style={{ marginTop: 20 }}>
              <button onClick={() => setMostrarForm(!mostrarForm)}>
                {mostrarForm ? "Fechar formulário" : "Nova denúncia 🚨"}
              </button>

              {mostrarForm && (
                <div
                  style={{
                    marginTop: 15,
                    padding: 15,
                    border: "1px solid #ccc",
                    borderRadius: 8,
                  }}
                >
                  <h3>Criar denúncia</h3>

                  <input
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                  />

                  <textarea
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                  />

                  <input
                    placeholder="Endereço"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                  />

                  <label style={{ display: "block", marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={anonimo}
                      onChange={(e) => setAnonimo(e.target.checked)}
                    />{" "}
                    Desejo fazer denúncia anônima
                  </label>

                  <button onClick={criarDenuncia}>Salvar denúncia</button>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 30 }}>
            <h3>{role === "admin" ? "Todas as denúncias" : "Suas denúncias"}</h3>

            <div
              style={{
                maxHeight: role === "admin" ? "420px" : "unset",
                overflowY: role === "admin" ? "auto" : "visible",
                paddingRight: role === "admin" ? "8px" : "0",
              }}
            >
              {denunciasExibidas.length === 0 && (
                <p>Nenhuma denúncia encontrada.</p>
              )}

              {denunciasExibidas.map((d) => (
                <div
                  key={d.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: 12,
                    marginBottom: 12,
                    borderRadius: 8,
                    backgroundColor: getStatusColor(d.status),
                  }}
                >
                  <strong>{d.titulo}</strong>
                  <p>{d.descricao}</p>
                  <small>{d.endereco}</small>

                  <p>
                    <strong>Autor:</strong> {d.nome_usuario || "Não informado"}
                  </p>

                  <p>
                    <small>
                      {d.created_at
                        ? new Date(d.created_at).toLocaleString()
                        : "Sem data"}
                    </small>
                  </p>

                  {role === "admin" ? (
                    <div style={{ marginTop: 10 }}>
                      <label>
                        <strong>Status:</strong>{" "}
                      </label>
                      <select
                        value={d.status}
                        onChange={(e) =>
                          atualizarStatus(d.id, e.target.value)
                        }
                        style={{ padding: 6, marginLeft: 8 }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p>
                      <strong>Status:</strong> {d.status}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {role === "user" && denuncias.length > 1 && (
              <button onClick={() => setMostrarTodos(!mostrarTodos)}>
                {mostrarTodos ? "Mostrar menos" : "..."}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;