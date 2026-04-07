import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);

  const [modo, setModo] = useState<"login" | "cadastro">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const role = user?.user_metadata?.role;

  // 🔎 validação simples de email
  const validarEmail = (email: string) => {
    return email.includes("@") && email.includes(".");
  };

  // 🔐 Cadastro
  const handleSignup = async () => {
    if (!validarEmail(email)) {
      alert("Email inválido");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "user",
        },
      },
    });

    alert(error ? error.message : "Conta criada!");
  };

  // 🔐 Login
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
    } else {
      alert("Logado!");
      getUser();
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDenuncias([]);
  };

  // 👤 Usuário
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  // 📋 Denúncias
  const carregarDenuncias = async () => {
    if (!user) return;

    let query = supabase.from("denuncias").select("*");

    if (role === "user") {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (!error) setDenuncias(data || []);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      carregarDenuncias();
    }
  }, [user]);

  const denunciasExibidas = mostrarTodos
    ? denuncias
    : denuncias.slice(0, 1);

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 20,
        fontFamily: "Arial",
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
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />

              <input
                type="password"
                placeholder="Senha"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br /><br />

              <button onClick={handleLogin}>Entrar</button>

              <p>
                Não tem conta?{" "}
                <button onClick={() => setModo("cadastro")}>
                  Cadastrar
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Cadastro</h2>

              <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />

              <input
                type="password"
                placeholder="Senha"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br /><br />

              <button onClick={handleSignup}>Cadastrar</button>

              <p>
                Já tem conta?{" "}
                <button onClick={() => setModo("login")}>
                  Login
                </button>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <h2>Bem-vindo 👋</h2>

          <button onClick={handleLogout}>Sair</button>

          <div style={{ marginTop: 30 }}>
            <h3>Suas denúncias</h3>

            {denunciasExibidas.map((d) => (
              <div
                key={d.id}
                style={{
                  border: "1px solid #ccc",
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 5,
                   backgroundColor: d.status === "aberto" ? "#ffe5e5" : "#e5ffe5"
                }}
              >
                <strong>{d.titulo}</strong>
                <p>{d.descricao}</p>
                <small>{d.endereco}</small>
                <p>Status: {d.status}</p>
              </div>
            ))}

            {denuncias.length > 1 && (
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