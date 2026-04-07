import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mostrarForm, setMostrarForm] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");

  const [denuncias, setDenuncias] = useState<any[]>([]);

  // 🔐 Cadastro
  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome },
      },
    });

    alert(error ? error.message : "Conta criada!");
  };

  //  Login
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });


    alert(error ? error.message : "Logado!");
    getUser();
    carregarDenuncias();

  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };


  //  Usuário
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  //  Criar denúncia
  const criarDenuncia = async () => {
    if (!user) return;

    const { error } = await supabase.from("denuncias").insert([
      {
        titulo,
        descricao,
        endereco,
        user_id: user.id,
      },
    ]);

    if (!error) {
      alert("Denúncia criada!");
      setMostrarForm(false);
      setTitulo("");
      setDescricao("");
      setEndereco("");
      carregarDenuncias(); // 🔥 atualiza lista
    } else {
      alert(error.message);
    }
  };

  //  LISTAR DENÚNCIAS
  const carregarDenuncias = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("denuncias")
      .select("*")
      .eq("user_id", user.id) // FILTRO AQUI
      .order("created_at", { ascending: false });

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

  return (
    <div style={{
      maxWidth: 600,
      margin: "0 auto",
      padding: 20,
      fontFamily: "Arial"
    }}>
      <h1>SOS Bichos 🐾</h1>

      {!user ? (
        <>
          <h2>Cadastro / Login</h2>

          <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
          <br />

          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <br />

          <input
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={handleSignup}>Cadastrar</button>
          <button onClick={handleLogin}>Login</button>
        </>
      ) : (
        <>
          <h2>Bem-vindo, {user?.user_metadata?.nome} 👋</h2>
          <button onClick={handleLogout}>
            Sair
          </button>

          <button onClick={() => setMostrarForm(true)}>
            Nova denúncia 🚨
          </button>

          {/* FORM */}
          {mostrarForm && (
            <div style={{ marginTop: 20 }}>
              <h3>Criar denúncia</h3>

              <input
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
              <br />

              <input
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <br />

              <input
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
              <br /><br />

              <button onClick={criarDenuncia}>Salvar</button>
            </div>
          )}

          {/* LISTA */}
          <div style={{ marginTop: 30 }}>
            <h3>Denúncias</h3>

            {denuncias.length === 0 && <p>Nenhuma denúncia ainda.</p>}

            {denuncias.map((d) => (
              <div
                key={d.id}
                style={{
                  border: "1px solid #ccc",
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 5,
                }}
              >
                <strong>{d.titulo}</strong>
                <p>{d.descricao}</p>
                <small>{d.endereco}</small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;