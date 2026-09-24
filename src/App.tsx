import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { MatchDetailPage } from "./pages/MatchDetailPage";
import { MatchesPage } from "./pages/MatchesPage";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<MatchesPage />} />
        <Route path="/matches/:matchId" element={<MatchDetailPage />} />
      </Routes>
    </div>
  );
}
