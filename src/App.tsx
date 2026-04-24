import { HomePage } from "./pages/HomePage";
import "./index.css";

function App() {
  return (
    <HomePage
      userName="Doggo"
      isAdmin={true}
      onLogout={() => console.log("Logout")}
    />
  );
}

export default App;