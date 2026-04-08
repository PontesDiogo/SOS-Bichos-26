import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationSelector({
  setCoords,
  setLocalizacaoConfirmada,
}: {
  setCoords: (coords: { lat: number; lng: number }) => void;
  setLocalizacaoConfirmada: (valor: boolean) => void;
}) {
  useMapEvents({
    click(e) {
      setCoords({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
      setLocalizacaoConfirmada(false);
    },
  });

  return null;
}

function App() {
  const [user, setUser] = useState<any>(null);

  const [modo, setModo] = useState<"login" | "cadastro">("login");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anonimo, setAnonimo] = useState(false);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarEnderecoModal, setMostrarEnderecoModal] = useState(false);

  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // Endereço
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // Mapa
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [localizacaoConfirmada, setLocalizacaoConfirmada] = useState(false);

  const role = user?.user_metadata?.role || "user";

  const statusOptions = [
    "Pendente",
    "Em análise",
    "Em atendimento",
    "Resolvido",
    "Cancelado",
  ];

  const estadosBrasil = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
    "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
    "SP","SE","TO"
  ];

  const validarEmail = (valor: string) => {
    return valor.includes("@") && valor.includes(".");
  };

  const formatarCEP = (valor: string) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);
    return numeros.replace(/(\d{5})(\d{1,3})/, "$1-$2");
  };

  const validarCEP = (valor: string) => {
    const limpo = valor.replace(/\D/g, "");
    return limpo.length === 8;
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

  const montarEndereco = () => {
    const partes = [
      rua && `Rua ${rua}`,
      numero && `Nº ${numero}`,
      cidade && cidade,
      estado && estado,
      cep && `CEP ${cep}`,
    ].filter(Boolean);

    return partes.join(", ");
  };

  const resumoEndereco = useMemo(() => {
    if (montarEndereco()) return montarEndereco();
    if (localizacaoConfirmada && coords) {
      return `Localização confirmada no mapa (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`;
    }
    return "Nenhum endereço selecionado";
  }, [rua, numero, cidade, estado, cep, localizacaoConfirmada, coords]);

  const regrasSenha = useMemo(() => {
    return {
      min8: password.length >= 8,
      minuscula: /[a-z]/.test(password),
      maiuscula: /[A-Z]/.test(password),
      numero: /\d/.test(password),
      especial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const pontuacaoSenha = Object.values(regrasSenha).filter(Boolean).length;

  const forcaSenha = useMemo(() => {
    if (!password) {
      return { texto: "", largura: "0%", cor: "#ddd" };
    }
    if (pontuacaoSenha <= 2) {
      return { texto: "Senha fraca", largura: "33%", cor: "#dc3545" };
    }
    if (pontuacaoSenha <= 4) {
      return { texto: "Senha média", largura: "66%", cor: "#ffc107" };
    }
    return { texto: "Senha forte", largura: "100%", cor: "#28a745" };
  }, [password, pontuacaoSenha]);

  const senhasCoincidem =
    confirmarSenha.length > 0 && password === confirmarSenha;

  const senhasDiferentes =
    confirmarSenha.length > 0 && password !== confirmarSenha;

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

    if (pontuacaoSenha < 5) {
      alert(
        "A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e símbolo especial."
      );
      return;
    }

    if (password !== confirmarSenha) {
      alert("As senhas não coincidem");
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

    if (error) {
      alert(error.message);
      return;
    }

    alert("Conta criada!");
    setNome("");
    setEmail("");
    setPassword("");
    setConfirmarSenha("");
    setModo("login");
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
    setMostrarEnderecoModal(false);
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

  const buscarCEP = async () => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("Digite um CEP válido com 8 números");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }

      setRua(data.logradouro || "");
      setCidade(data.localidade || "");
      setEstado(data.uf || "");
      setCep(data.cep || formatarCEP(cep));
    } catch {
      alert("Não foi possível buscar o CEP agora");
    }
  };

  const confirmarEndereco = () => {
    const temEnderecoManual = rua.trim().length > 0;

    if (!temEnderecoManual && !localizacaoConfirmada) {
      alert("Informe pelo menos a rua ou confirme a localização no mapa");
      return;
    }

    if (cep && !validarCEP(cep)) {
      alert("CEP inválido");
      return;
    }

    setMostrarEnderecoModal(false);
  };

  const criarDenuncia = async () => {
    if (!user) {
      alert("Faça login primeiro");
      return;
    }

    if (!titulo.trim() || !descricao.trim()) {
      alert("Preencha título e descrição");
      return;
    }

    const temEnderecoManual = rua.trim().length > 0;

    if (!temEnderecoManual && !localizacaoConfirmada) {
      alert("Selecione um endereço antes de salvar a denúncia");
      return;
    }

    if (cep && !validarCEP(cep)) {
      alert("CEP inválido");
      return;
    }

    const nomeAutor = anonimo
      ? "Anônimo"
      : user?.user_metadata?.nome || user?.email || "Usuário";

    const { error } = await supabase.from("denuncias").insert([
      {
        titulo,
        descricao,
        endereco: montarEndereco() || "Local informado apenas pelo mapa",
        user_id: user.id,
        nome_usuario: nomeAutor,
        anonimo,
        status: "Pendente",
        latitude: localizacaoConfirmada ? coords?.lat : null,
        longitude: localizacaoConfirmada ? coords?.lng : null,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Denúncia criada!");
    setTitulo("");
    setDescricao("");
    setAnonimo(false);

    setRua("");
    setNumero("");
    setCep("");
    setCidade("");
    setEstado("");
    setCoords(null);
    setLocalizacaoConfirmada(false);

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

  const inputStyle = {
    width: "100%",
    padding: "10px 42px 10px 10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none" as const,
    boxSizing: "border-box" as const,
  };

  const normalInputStyle = {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none" as const,
    boxSizing: "border-box" as const,
  };

  const senhaWrapperStyle = {
    position: "relative" as const,
    marginBottom: 10,
  };

  const botaoOlhoStyle = {
    position: "absolute" as const,
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 12,
    color: "#555",
    padding: "4px 6px",
  };

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
                style={normalInputStyle}
              />

              <div style={senhaWrapperStyle}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={botaoOlhoStyle}
                >
                  {mostrarSenha ? "Ocultar" : "Ver"}
                </button>
              </div>

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
                style={normalInputStyle}
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={normalInputStyle}
              />

              <div style={senhaWrapperStyle}>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={botaoOlhoStyle}
                >
                  {mostrarSenha ? "Ocultar" : "Ver"}
                </button>
              </div>

              <div
                style={{
                  height: 8,
                  backgroundColor: "#e9ecef",
                  borderRadius: 999,
                  overflow: "hidden",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: forcaSenha.largura,
                    height: "100%",
                    backgroundColor: forcaSenha.cor,
                    transition: "all 0.3s ease",
                  }}
                />
              </div>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  color: forcaSenha.cor,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {forcaSenha.texto}
              </p>

              <div
                style={{
                  fontSize: 13,
                  marginBottom: 12,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ color: regrasSenha.min8 ? "#28a745" : "#666" }}>
                  {regrasSenha.min8 ? "✅" : "•"} Mínimo de 8 caracteres
                </div>
                <div
                  style={{ color: regrasSenha.minuscula ? "#28a745" : "#666" }}
                >
                  {regrasSenha.minuscula ? "✅" : "•"} Letra minúscula
                </div>
                <div
                  style={{ color: regrasSenha.maiuscula ? "#28a745" : "#666" }}
                >
                  {regrasSenha.maiuscula ? "✅" : "•"} Letra maiúscula
                </div>
                <div style={{ color: regrasSenha.numero ? "#28a745" : "#666" }}>
                  {regrasSenha.numero ? "✅" : "•"} Número
                </div>
                <div
                  style={{ color: regrasSenha.especial ? "#28a745" : "#666" }}
                >
                  {regrasSenha.especial ? "✅" : "•"} Símbolo especial
                </div>
              </div>

              <div style={senhaWrapperStyle}>
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  placeholder="Confirmar senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() =>
                    setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                  }
                  style={botaoOlhoStyle}
                >
                  {mostrarConfirmarSenha ? "Ocultar" : "Ver"}
                </button>
              </div>

              {senhasCoincidem && (
                <p
                  style={{
                    color: "#28a745",
                    fontSize: 13,
                    marginTop: -4,
                    marginBottom: 10,
                  }}
                >
                  ✅ As senhas coincidem
                </p>
              )}

              {senhasDiferentes && (
                <p
                  style={{
                    color: "#dc3545",
                    fontSize: 13,
                    marginTop: -4,
                    marginBottom: 10,
                  }}
                >
                  ❌ As senhas não coincidem
                </p>
              )}

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
                    position: "relative",
                  }}
                >
                  <h3>Criar denúncia</h3>

                  <input
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    style={normalInputStyle}
                  />

                  <textarea
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    style={{
                      ...normalInputStyle,
                      minHeight: 100,
                      resize: "vertical",
                    }}
                  />

                  <div
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 10,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setMostrarEnderecoModal(true)}
                      style={{ marginBottom: 8 }}
                    >
                      Selecionar endereço
                    </button>

                    <div style={{ fontSize: 14 }}>
                      <strong>Endereço</strong>
                      <p style={{ margin: "6px 0 0 0", color: "#666" }}>
                        {resumoEndereco}
                      </p>
                    </div>
                  </div>

                  <label style={{ display: "block", marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={anonimo}
                      onChange={(e) => setAnonimo(e.target.checked)}
                    />{" "}
                    Desejo fazer denúncia anônima
                  </label>

                  <button onClick={criarDenuncia}>Salvar denúncia</button>

                  {mostrarEnderecoModal && (
                    <div
                      style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: 16,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#fff",
                          width: "100%",
                          maxWidth: 700,
                          maxHeight: "90vh",
                          overflowY: "auto",
                          borderRadius: 12,
                          padding: 16,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                          }}
                        >
                          <h3 style={{ margin: 0 }}>Endereço da denúncia</h3>
                          <button
                            type="button"
                            onClick={() => setMostrarEnderecoModal(false)}
                          >
                            Fechar
                          </button>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            gap: 8,
                            marginBottom: 10,
                          }}
                        >
                          <input
                            placeholder="CEP"
                            value={cep}
                            onChange={(e) => setCep(formatarCEP(e.target.value))}
                            style={{
                              ...normalInputStyle,
                              marginBottom: 0,
                            }}
                          />
                          <button type="button" onClick={buscarCEP}>
                            Buscar CEP
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => window.open("https://viacep.com.br/", "_blank")}
                          style={{ marginBottom: 12 }}
                        >
                          Não sei meu CEP
                        </button>

                        <input
                          placeholder="Rua"
                          value={rua}
                          onChange={(e) => setRua(e.target.value)}
                          style={normalInputStyle}
                        />

                        <input
                          placeholder="Número"
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                          style={normalInputStyle}
                        />

                        <input
                          placeholder="Cidade"
                          value={cidade}
                          onChange={(e) => setCidade(e.target.value)}
                          style={normalInputStyle}
                        />

                        <select
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          style={normalInputStyle}
                        >
                          <option value="">Selecione o estado</option>
                          {estadosBrasil.map((uf) => (
                            <option key={uf} value={uf}>
                              {uf}
                            </option>
                          ))}
                        </select>

                        <div style={{ marginBottom: 10 }}>
                          <p style={{ marginBottom: 8 }}>
                            <strong>Ou selecione no mapa:</strong>
                          </p>

                          <MapContainer
                            center={[-23.2643, -47.2992]}
                            zoom={13}
                            style={{
                              height: "300px",
                              width: "100%",
                              borderRadius: 8,
                              overflow: "hidden",
                            }}
                          >
                            <TileLayer
                              attribution='&copy; OpenStreetMap contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationSelector
                              setCoords={setCoords}
                              setLocalizacaoConfirmada={setLocalizacaoConfirmada}
                            />
                            {coords && (
                              <Marker position={[coords.lat, coords.lng]} />
                            )}
                          </MapContainer>

                          {coords && (
                            <div style={{ marginTop: 8 }}>
                              <p style={{ fontSize: 14, marginBottom: 8 }}>
                                Local selecionado: {coords.lat.toFixed(5)},{" "}
                                {coords.lng.toFixed(5)}
                              </p>

                              <button
                                type="button"
                                onClick={() => setLocalizacaoConfirmada(true)}
                                style={{ marginRight: 8 }}
                              >
                                Confirmar localização
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setCoords(null);
                                  setLocalizacaoConfirmada(false);
                                }}
                              >
                                Limpar localização
                              </button>

                              {localizacaoConfirmada && (
                                <p style={{ color: "#28a745", marginTop: 8 }}>
                                  ✅ Localização confirmada
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setMostrarEnderecoModal(false)}
                          >
                            Cancelar
                          </button>
                          <button type="button" onClick={confirmarEndereco}>
                            Confirmar endereço
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 30 }}>
            <h3>{role === "admin" ? "Todas as denúncias" : "Suas denúncias"}</h3>

            <div
              style={{
                maxHeight:
                  role === "admin"
                    ? "420px"
                    : mostrarTodos
                    ? "320px"
                    : "unset",
                overflowY:
                  role === "admin"
                    ? "auto"
                    : mostrarTodos
                    ? "auto"
                    : "visible",
                paddingRight:
                  role === "admin" || mostrarTodos ? "8px" : "0",
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

                  {d.latitude && d.longitude && (
                    <p style={{ fontSize: 13 }}>
                      📍 {Number(d.latitude).toFixed(5)},{" "}
                      {Number(d.longitude).toFixed(5)}
                    </p>
                  )}

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