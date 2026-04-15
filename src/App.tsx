import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "./index.css";
import "leaflet/dist/leaflet.css";

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
    click(e: LeafletMouseEvent) {
      setCoords({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
      setLocalizacaoConfirmada(false);
    },
  });

  return null;
}

type TipoOcorrencia =
  | "MAUS_TRATOS"
  | "ANIMAL_FERIDO"
  | "ANIMAL_ABANDONADO"
  | "SITUACAO_DE_RISCO"
  | "SUSPEITA_ZOONOSE"
  | "INFESTACAO_FOCO_SANITARIO"
  | "ANIMAL_MORTO_VIA_PUBLICA"
  | "SOLICITACAO_RESGATE"
  | "OUTROS";

type Gravidade = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
type AbaAdmin = "visaoGeral" | "denuncias" | "relatorios";

const tiposOcorrencia: {
  value: TipoOcorrencia;
  label: string;
  gravidade: Gravidade;
}[] = [
  { value: "MAUS_TRATOS", label: "Maus-tratos", gravidade: "CRITICA" },
  { value: "ANIMAL_FERIDO", label: "Animal ferido", gravidade: "ALTA" },
  { value: "ANIMAL_ABANDONADO", label: "Animal abandonado", gravidade: "ALTA" },
  { value: "SITUACAO_DE_RISCO", label: "Animal em situação de risco", gravidade: "ALTA" },
  { value: "SUSPEITA_ZOONOSE", label: "Suspeita de zoonose", gravidade: "CRITICA" },
  { value: "INFESTACAO_FOCO_SANITARIO", label: "Infestação / foco sanitário", gravidade: "CRITICA" },
  { value: "ANIMAL_MORTO_VIA_PUBLICA", label: "Animal morto em via pública", gravidade: "MEDIA" },
  { value: "SOLICITACAO_RESGATE", label: "Solicitação de resgate", gravidade: "MEDIA" },
  { value: "OUTROS", label: "Outros", gravidade: "BAIXA" },
];

const obterGravidadePorTipo = (tipo: TipoOcorrencia): Gravidade => {
  return tiposOcorrencia.find((item) => item.value === tipo)?.gravidade || "BAIXA";
};

const formatarTipoOcorrencia = (tipo: string) => {
  return tiposOcorrencia.find((item) => item.value === tipo)?.label || tipo || "Não informado";
};

function App() {
  const [user, setUser] = useState<any>(null);
<<<<<<< HEAD

=======
>>>>>>> f342a9b (feat: aplica layout responsivo e padroniza interface do sistema)
  const [modo, setModo] = useState<"login" | "cadastro" | "recuperarSenha">("login");

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
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.2643, -47.2992]);
  const [localizacaoConfirmada, setLocalizacaoConfirmada] = useState(false);

  const [tipoOcorrencia, setTipoOcorrencia] = useState<TipoOcorrencia>("MAUS_TRATOS");
  const [outroTipoOcorrencia, setOutroTipoOcorrencia] = useState("");
  const [abaAdmin, setAbaAdmin] = useState<AbaAdmin>("visaoGeral");

  const [filtroTipoAdmin, setFiltroTipoAdmin] = useState("TODOS");
  const [filtroStatusAdmin, setFiltroStatusAdmin] = useState("TODOS");

  const role = user?.user_metadata?.role || "user";

  const statusOptions = [
    "Pendente",
    "Em análise",
    "Em atendimento",
    "Resolvido",
    "Cancelado",
  ];

  const estadosBrasil = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
    "SP", "SE", "TO"
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
    const endereco = montarEndereco();
    if (endereco) return endereco;
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

  const handleResetPassword = async () => {
    if (!validarEmail(email)) {
      alert("Informe um e-mail válido");
      return;
    }

    const emailLimpo = email.trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(emailLimpo, {
      redirectTo: window.location.origin,
    });

    if (error) {
      alert("Erro ao solicitar recuperação de senha: " + error.message);
      return;
    }

    alert("Se existir uma conta com esse e-mail, o link de recuperação será enviado.");
    setModo("login");
  };

  const denunciasFiltradasAdmin = useMemo(() => {
    return denuncias.filter((d) => {
      const tipoOk =
        filtroTipoAdmin === "TODOS" || d.tipo_ocorrencia === filtroTipoAdmin;

      const statusOk =
        filtroStatusAdmin === "TODOS" || d.status === filtroStatusAdmin;

      return tipoOk && statusOk;
    });
  }, [denuncias, filtroTipoAdmin, filtroStatusAdmin]);

  const resumoPorTipo = useMemo(() => {
    return tiposOcorrencia
      .map((tipo) => ({
        label: tipo.label,
        total: denuncias.filter((d) => d.tipo_ocorrencia === tipo.value).length,
      }))
      .filter((item) => item.total > 0);
  }, [denuncias]);

  const resumoPorGravidade = useMemo(() => {
    const totais = {
      BAIXA: 0,
      MEDIA: 0,
      ALTA: 0,
      CRITICA: 0,
    };

    denuncias.forEach((d) => {
      const gravidade = (d.gravidade as Gravidade) || "BAIXA";
      totais[gravidade] += 1;
    });

    return totais;
  }, [denuncias]);

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

  const buscarLocalizacaoAtual = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setMapCenter([latitude, longitude]);
        setCoords({ lat: latitude, lng: longitude });
        setLocalizacaoConfirmada(true);
      },
      () => {
        setMapCenter([-23.2643, -47.2992]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
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

    if (!tipoOcorrencia) {
      alert("Selecione o tipo de ocorrência");
      return;
    }

    if (tipoOcorrencia === "OUTROS" && !outroTipoOcorrencia.trim()) {
      alert('Descreva o tipo da ocorrência ao selecionar "Outros"');
      return;
    }

    const gravidade = obterGravidadePorTipo(tipoOcorrencia);

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
        tipo_ocorrencia: tipoOcorrencia,
        tipo_ocorrencia_outros:
          tipoOcorrencia === "OUTROS" ? outroTipoOcorrencia.trim() : null,
        gravidade,
        cidade,
        estado,
        cep,
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
    setMapCenter([-23.2643, -47.2992]);
    setMostrarForm(false);
    setTipoOcorrencia("MAUS_TRATOS");
    setOutroTipoOcorrencia("");
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
  useEffect(() => {
    if (mostrarEnderecoModal) {
      buscarLocalizacaoAtual();
    }
  }, [mostrarEnderecoModal]);

  useEffect(() => {
    if (mostrarEnderecoModal) {
      buscarLocalizacaoAtual();
    }
  }, [mostrarEnderecoModal]);

  const denunciasExibidas =
    role === "user" && !mostrarTodos ? denuncias.slice(0, 1) : denuncias;

<<<<<<< HEAD
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
  const buscarLocalizacaoAtual = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setMapCenter([latitude, longitude]);
        setCoords({ lat: latitude, lng: longitude });
        setLocalizacaoConfirmada(true);
      },
      (error) => {
        console.warn("Não foi possível obter localização atual:", error.message);
        setMapCenter([-23.2643, -47.2992]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
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

      {!user ? (
        <>
          {modo === "login" ? (
            <div className="auth-page">
              <div className="auth-card">

                {/* IMAGEM */}
                <div className="auth-hero">
                  <img src="/dog.png" alt="SOS Bichos" />
                  <div className="auth-title">SOS Bichos</div>
                </div>

                <div className="auth-body">
                  <label className="auth-label">Endereço de email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                  />

                  <label className="auth-label">Senha</label>
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                  />

                  <button onClick={handleLogin} className="auth-button">
                    Login
                  </button>

                  <button
                    onClick={() => setModo("recuperarSenha")}
                    className="auth-link"
                  >
                    Esqueci minha senha
                  </button>

                  <button
                    onClick={() => setModo("cadastro")}
                    className="auth-link"
                  >
                    Não possui cadastro?
                  </button>
                </div>
              </div>
            </div>
          ) : modo === "recuperarSenha" ? (
            <div className="auth-page">
              <div className="auth-card">
                <div className="auth-body">
                  <h2>Recuperar senha</h2>

                  <label className="auth-label">Seu e-mail</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                  />

                  <button onClick={handleResetPassword} className="auth-button">
                    Enviar link
                  </button>

                  <button onClick={() => setModo("login")} className="auth-link">
                    Voltar
                  </button>
                </div>
              </div>
            </div>) : (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
              <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">
                {/* Header com Logo */}
                <div className="bg-gradient-to-b from-teal-400 to-teal-500 py-8 text-center">
                  <h1 className="text-4xl font-bold text-white tracking-wider">SOS BICHOS</h1>
                </div>

                {/* Formulário */}
                <div className="p-6">
                  {/* Nome */}
                  <div className="mb-4">
                    <label className="block text-gray-800 text-sm font-bold mb-2">
                      Nome:
                    </label>
                    <input
                      placeholder=""
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-3 bg-teal-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="block text-gray-800 text-sm font-bold mb-2">
                      Endereço de E-mail:
                    </label>
                    <input
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-teal-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    />
                  </div>

                  {/* Senha */}
                  <div className="mb-4">
                    <label className="block text-gray-800 text-sm font-bold mb-2">
                      Senha:
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarSenha ? "text" : "password"}
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-teal-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        className="absolute right-4 top-3 text-teal-600 hover:text-teal-700 text-xl"
                      >
                        {mostrarSenha ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>

                    {/* Força da Senha - Indicador Visual */}
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: forcaSenha.largura,
                            height: "100%",
                            backgroundColor: forcaSenha.cor,
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Requisitos da Senha em tamanho reduzido */}
                    <div className="mt-2 text-xs space-y-0.5">
                      <div style={{ color: regrasSenha.min8 ? "#28a745" : "#999" }}>
                        {regrasSenha.min8 ? "✅" : "○"} 8 caracteres
                      </div>
                      <div style={{ color: regrasSenha.maiuscula ? "#28a745" : "#999" }}>
                        {regrasSenha.maiuscula ? "✅" : "○"} Letra maiúscula
                      </div>
                      <div style={{ color: regrasSenha.minuscula ? "#28a745" : "#999" }}>
                        {regrasSenha.minuscula ? "✅" : "○"} Letra minúscula
                      </div>
                      <div style={{ color: regrasSenha.numero ? "#28a745" : "#999" }}>
                        {regrasSenha.numero ? "✅" : "○"} Número
                      </div>
                      <div style={{ color: regrasSenha.especial ? "#28a745" : "#999" }}>
                        {regrasSenha.especial ? "✅" : "○"} Símbolo especial
                      </div>
                    </div>
                  </div>

                  {/* Confirmar Senha */}
                  <div className="mb-6">
                    <label className="block text-gray-800 text-sm font-bold mb-2">
                      Confirmar senha:
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarConfirmarSenha ? "text" : "password"}
                        placeholder=""
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="w-full px-4 py-3 bg-teal-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                        className="absolute right-4 top-3 text-teal-600 hover:text-teal-700 text-xl"
                      >
                        {mostrarConfirmarSenha ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>

                    {/* Validação de Senhas */}
                    {senhasCoincidem && (
                      <p className="text-xs text-green-600 font-semibold mt-2">
                        ✅ As senhas coincidem
                      </p>
                    )}
                    {senhasDiferentes && (
                      <p className="text-xs text-red-600 font-semibold mt-2">
                        ❌ As senhas não coincidem
                      </p>
                    )}
                  </div>

                  {/* Checkbox Política de Privacidade */}
                  <div className="mb-6 flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="politica"
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                      defaultChecked={false}
                    />
                    <label htmlFor="politica" className="text-xs text-gray-700">
                      Li e concordo com os termos de{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Link para Política de Privacidade em desenvolvimento");
                        }}
                        className="text-teal-600 hover:text-teal-700 font-semibold"
                      >
                        Política de Privacidade
                      </a>
                    </label>
                  </div>

                  {/* Botão Cadastrar */}
                  <button
                    onClick={handleSignup}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition mb-4"
                  >
                    Cadastrar
                  </button>


                </div>

                {/* Link para Login */}
                <p className="text-center text-gray-700 text-sm">
                  Já tenho cadastro{" "}
                  <button
                    onClick={() => setModo("login")}
                    className="text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    Faça login
                  </button>
                </p>
              </div>
            </div>

          )}
        </>
      ) : (
        <>
          <h2>Bem-vindo, {user?.user_metadata?.nome || user?.email} 👋</h2>
          <p>
            <strong>Perfil:</strong> {role}
          </p>

          <button onClick={handleLogout}>Sair</button>
          {role === "admin" && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 20,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setAbaAdmin("visaoGeral")}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  backgroundColor: abaAdmin === "visaoGeral" ? "#222" : "#fff",
                  color: abaAdmin === "visaoGeral" ? "#fff" : "#000",
                }}
              >
                Visão geral
              </button>

              <button
                onClick={() => setAbaAdmin("denuncias")}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  backgroundColor: abaAdmin === "denuncias" ? "#222" : "#fff",
                  color: abaAdmin === "denuncias" ? "#fff" : "#000",
                }}
              >
                Denúncias
              </button>

              <button
                onClick={() => setAbaAdmin("relatorios")}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  backgroundColor: abaAdmin === "relatorios" ? "#222" : "#fff",
                  color: abaAdmin === "relatorios" ? "#fff" : "#000",
                }}
              >
                Relatórios
              </button>
            </div>
          )}

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
                  <select
                    value={tipoOcorrencia}
                    onChange={(e) => setTipoOcorrencia(e.target.value as TipoOcorrencia)}
                    style={normalInputStyle}
                  >
                    {tiposOcorrencia.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                  {tipoOcorrencia === "OUTROS" && (
                    <input
                      placeholder="Descreva o tipo da ocorrência"
                      value={outroTipoOcorrencia}
                      onChange={(e) => setOutroTipoOcorrencia(e.target.value)}
                      style={normalInputStyle}
                    />
                  )}

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
=======
  return (
    <div className="app-shell">
      <div className="app-container">
        {!user ? (
          <>
            {modo === "login" ? (
              <div className="auth-page">
                <div className="auth-card">
                  <div className="auth-hero">
                    <img src="/dog.png" alt="SOS Bichos" />
                    <div className="auth-title">SOS Bichos</div>
>>>>>>> f342a9b (feat: aplica layout responsivo e padroniza interface do sistema)
                  </div>

                  <div className="auth-body">
                    <label className="auth-label">Endereço de email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                    />

                    <label className="auth-label">Senha</label>
                    <div className="password-field">
                      <input
                        type={mostrarSenha ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                      >
                        {mostrarSenha ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>

                    <button onClick={handleLogin} className="auth-button">
                      Login
                    </button>

                    <button
                      onClick={() => setModo("recuperarSenha")}
                      className="auth-link"
                    >
                      Esqueci minha senha
                    </button>

                    <button
                      onClick={() => setModo("cadastro")}
                      className="auth-link"
                    >
                      Não possui cadastro?
                    </button>
                  </div>
                </div>
              </div>
            ) : modo === "recuperarSenha" ? (
              <div className="auth-page">
                <div className="auth-card">
                  <div className="auth-body">
                    <h2>Recuperar senha</h2>

                    <label className="auth-label">Seu e-mail</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                    />

                    <button onClick={handleResetPassword} className="auth-button">
                      Enviar link
                    </button>

                    <button onClick={() => setModo("login")} className="auth-link">
                      Voltar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-page">
                <div className="auth-card">
                  <div className="auth-hero">
                    <img src="/dog.png" alt="Cadastro SOS Bichos" />
                    <div className="auth-title">Cadastre-se</div>
                  </div>

                  <div className="auth-body">
                    <label className="auth-label">Nome</label>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="auth-input"
                    />

                    <label className="auth-label">Endereço de e-mail</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                    />

                    <label className="auth-label">Senha</label>
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input"
                    />

                    <label className="auth-label">Confirmar senha</label>
                    <input
                      type={mostrarConfirmarSenha ? "text" : "password"}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="auth-input"
                    />

                    <div style={{ marginBottom: 10 }}>
                      <div
                        style={{
                          height: 8,
                          backgroundColor: "#e5e7eb",
                          borderRadius: 999,
                          overflow: "hidden",
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
<<<<<<< HEAD

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
                            key={`${mapCenter[0]}-${mapCenter[1]}`}
                            center={mapCenter}
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
                                  setMapCenter([-23.2643, -47.2992]);
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
=======
>>>>>>> f342a9b (feat: aplica layout responsivo e padroniza interface do sistema)
                      </div>
                    </div>

                    {senhasCoincidem && (
                      <p style={{ color: "#16a34a", fontSize: 13, marginTop: 0 }}>
                        ✅ As senhas coincidem
                      </p>
                    )}

                    {senhasDiferentes && (
                      <p style={{ color: "#dc2626", fontSize: 13, marginTop: 0 }}>
                        ❌ As senhas não coincidem
                      </p>
                    )}

                    <button onClick={handleSignup} className="auth-button">
                      Cadastrar
                    </button>

                    <button onClick={() => setModo("login")} className="auth-link">
                      Já tenho cadastro
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="app-header">
              <div>
                <h1 className="app-title">SOS Bichos 🐾</h1>
                <p className="app-subtitle">
                  Plataforma de denúncias e acompanhamento de ocorrências
                </p>
              </div>

              <div className="app-user-box">
                <span className="app-tag">
                  {user?.user_metadata?.nome || user?.email}
                </span>
                <span className="app-tag">Perfil: {role}</span>
                <button onClick={handleLogout} className="app-button-secondary">
                  Sair
                </button>
              </div>
            </div>

            {role === "admin" && (
              <div className="admin-nav">
                <button
                  onClick={() => setAbaAdmin("visaoGeral")}
                  className={abaAdmin === "visaoGeral" ? "app-button" : "app-button-secondary"}
                >
                  Visão geral
                </button>

                <button
                  onClick={() => setAbaAdmin("denuncias")}
                  className={abaAdmin === "denuncias" ? "app-button" : "app-button-secondary"}
                >
                  Denúncias
                </button>

                <button
                  onClick={() => setAbaAdmin("relatorios")}
                  className={abaAdmin === "relatorios" ? "app-button" : "app-button-secondary"}
                >
                  Relatórios
                </button>
              </div>
            )}

            {role === "user" && (
              <div className="section-card">
                <button onClick={() => setMostrarForm(!mostrarForm)} className="app-button">
                  {mostrarForm ? "Fechar formulário" : "Nova denúncia 🚨"}
                </button>

                {mostrarForm && (
                  <div className="section-card" style={{ marginTop: 16 }}>
                    <h3 className="section-title">Criar denúncia</h3>

                    <div className="form-grid">
                      <input
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="field-input"
                      />

                      <select
                        value={tipoOcorrencia}
                        onChange={(e) => setTipoOcorrencia(e.target.value as TipoOcorrencia)}
                        className="field-select"
                      >
                        {tiposOcorrencia.map((tipo) => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </select>

                      {tipoOcorrencia === "OUTROS" && (
                        <input
                          placeholder="Descreva o tipo da ocorrência"
                          value={outroTipoOcorrencia}
                          onChange={(e) => setOutroTipoOcorrencia(e.target.value)}
                          className="field-input"
                        />
                      )}

                      <textarea
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="field-textarea"
                      />
                    </div>

                    <div className="info-box">
                      <button
                        type="button"
                        onClick={() => setMostrarEnderecoModal(true)}
                        className="app-button-secondary"
                        style={{ marginBottom: 10 }}
                      >
                        Selecionar endereço
                      </button>

                      <div>
                        <strong>Endereço</strong>
                        <p className="info-muted" style={{ marginTop: 6 }}>
                          {resumoEndereco}
                        </p>
                      </div>
                    </div>

                    <label style={{ display: "block", margin: "12px 0" }}>
                      <input
                        type="checkbox"
                        checked={anonimo}
                        onChange={(e) => setAnonimo(e.target.checked)}
                      />{" "}
                      Desejo fazer denúncia anônima
                    </label>

                    <button onClick={criarDenuncia} className="app-button">
                      Salvar denúncia
                    </button>

                    {mostrarEnderecoModal && (
                      <div className="modal-overlay">
                        <div className="modal-card">
                          <div className="modal-header">
                            <h3 style={{ margin: 0 }}>Endereço da denúncia</h3>
                            <button
                              type="button"
                              onClick={() => setMostrarEnderecoModal(false)}
                              className="app-button-secondary"
                            >
                              Fechar
                            </button>
                          </div>

                          <div className="form-row-2">
                            <input
                              placeholder="CEP"
                              value={cep}
                              onChange={(e) => setCep(formatarCEP(e.target.value))}
                              className="field-input"
                            />
                            <button type="button" onClick={buscarCEP} className="app-button">
                              Buscar CEP
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => window.open("https://viacep.com.br/", "_blank")}
                            className="app-button-secondary"
                            style={{ marginBottom: 12 }}
                          >
                            Não sei meu CEP
                          </button>

                          <div className="form-row-2">
                            <input
                              placeholder="Rua"
                              value={rua}
                              onChange={(e) => setRua(e.target.value)}
                              className="field-input"
                            />

                            <input
                              placeholder="Número"
                              value={numero}
                              onChange={(e) => setNumero(e.target.value)}
                              className="field-input"
                            />
                          </div>

                          <div className="form-row-2">
                            <input
                              placeholder="Cidade"
                              value={cidade}
                              onChange={(e) => setCidade(e.target.value)}
                              className="field-input"
                            />

                            <select
                              value={estado}
                              onChange={(e) => setEstado(e.target.value)}
                              className="field-select"
                            >
                              <option value="">Selecione o estado</option>
                              {estadosBrasil.map((uf) => (
                                <option key={uf} value={uf}>
                                  {uf}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ marginBottom: 10 }}>
                            <p style={{ marginBottom: 8 }}>
                              <strong>Ou selecione no mapa:</strong>
                            </p>

                            <MapContainer
                              key={`${mapCenter[0]}-${mapCenter[1]}`}
                              center={mapCenter}
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
                                  className="app-button"
                                  style={{ marginRight: 8 }}
                                >
                                  Confirmar localização
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setCoords(null);
                                    setLocalizacaoConfirmada(false);
                                    setMapCenter([-23.2643, -47.2992]);
                                  }}
                                  className="app-button-secondary"
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
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => setMostrarEnderecoModal(false)}
                              className="app-button-secondary"
                            >
                              Cancelar
                            </button>
                            <button type="button" onClick={confirmarEndereco} className="app-button">
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

            {(role !== "admin" || abaAdmin === "denuncias") && (
              <div className="section-card">
                <h3 className="section-title">
                  {role === "admin" ? "Todas as denúncias" : "Suas denúncias"}
                </h3>

                {role === "admin" && (
                  <div className="form-row-2">
                    <select
                      value={filtroTipoAdmin}
                      onChange={(e) => setFiltroTipoAdmin(e.target.value)}
                      className="field-select"
                    >
                      <option value="TODOS">Todos os tipos</option>
                      {tiposOcorrencia.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={filtroStatusAdmin}
                      onChange={(e) => setFiltroStatusAdmin(e.target.value)}
                      className="field-select"
                    >
                      <option value="TODOS">Todos os status</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="list-scroll">
                  {(role === "admin" ? denunciasFiltradasAdmin : denunciasExibidas).length === 0 && (
                    <p>Nenhuma denúncia encontrada.</p>
                  )}

                  {(role === "admin" ? denunciasFiltradasAdmin : denunciasExibidas).map((d) => (
                    <div
                      key={d.id}
                      className="denuncia-card"
                      style={{ backgroundColor: getStatusColor(d.status) }}
                    >
                      <h4 className="denuncia-title">{d.titulo}</h4>
                      <p>{d.descricao}</p>
                      <p className="denuncia-meta">{d.endereco}</p>

                      <div className="badge-row">
                        <span className="badge">
                          Tipo: {formatarTipoOcorrencia(d.tipo_ocorrencia)}
                        </span>

                        {role === "admin" && (
                          <span className="badge">
                            Gravidade: {d.gravidade || "Não informada"}
                          </span>
                        )}

                        <span className="badge">Status: {d.status}</span>
                      </div>

                      {d.tipo_ocorrencia === "OUTROS" && d.tipo_ocorrencia_outros && (
                        <p className="denuncia-meta">
                          <strong>Complemento:</strong> {d.tipo_ocorrencia_outros}
                        </p>
                      )}

                      <p className="denuncia-meta">
                        <strong>Autor:</strong> {d.nome_usuario || "Não informado"}
                      </p>

                      <p className="denuncia-meta">
                        <small>
                          {d.created_at
                            ? new Date(d.created_at).toLocaleString()
                            : "Sem data"}
                        </small>
                      </p>

                      {d.latitude && d.longitude && (
                        <p className="denuncia-meta">
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
                            onChange={(e) => atualizarStatus(d.id, e.target.value)}
                            className="field-select"
                            style={{ marginTop: 8 }}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="denuncia-meta">
                          <strong>Status:</strong> {d.status}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {role === "user" && denuncias.length > 1 && (
                  <button onClick={() => setMostrarTodos(!mostrarTodos)} className="app-button-secondary">
                    {mostrarTodos ? "Mostrar menos" : "Mostrar mais"}
                  </button>
                )}
              </div>
            )}

            {role === "admin" && abaAdmin === "visaoGeral" && (
              <div className="section-card">
                <h3 className="section-title">Resumo administrativo</h3>

                <div className="admin-grid">
                  <div className="admin-stat">
                    <strong>Total de denúncias</strong>
                    <span>{denuncias.length}</span>
                  </div>

                  <div className="admin-stat">
                    <strong>Críticas</strong>
                    <span>{resumoPorGravidade.CRITICA}</span>
                  </div>

                  <div className="admin-stat">
                    <strong>Altas</strong>
                    <span>{resumoPorGravidade.ALTA}</span>
                  </div>

                  <div className="admin-stat">
                    <strong>Em atendimento</strong>
                    <span>{denuncias.filter((d) => d.status === "Em atendimento").length}</span>
                  </div>
                </div>

                <div className="info-box">
                  <strong>Ocorrências por tipo</strong>
                  <div style={{ marginTop: 10 }}>
                    {resumoPorTipo.length === 0 ? (
                      <p style={{ margin: 0 }}>Nenhuma denúncia cadastrada ainda.</p>
                    ) : (
                      resumoPorTipo.map((item) => (
                        <div
                          key={item.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "6px 0",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <span>{item.label}</span>
                          <strong>{item.total}</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {role === "admin" && abaAdmin === "relatorios" && (
              <div className="section-card">
                <h3 className="section-title">Base para relatórios</h3>

                <div className="info-box">
                  <p><strong>Total de denúncias:</strong> {denuncias.length}</p>
                  <p><strong>Total de denúncias críticas:</strong> {resumoPorGravidade.CRITICA}</p>
                  <p><strong>Total de denúncias altas:</strong> {resumoPorGravidade.ALTA}</p>
                  <p><strong>Tipos diferentes registrados:</strong> {resumoPorTipo.length}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
