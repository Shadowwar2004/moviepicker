import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MovieDetail from "./pages/MovieDetail";
import ActorDetail from "./pages/ActorDetail"; // <--- IMPORT

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen text-black relative font-sans">
                <Navbar />
                <div className="px-0">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/movie/:id" element={<MovieDetail />} />
                        <Route path="/person/:id" element={<ActorDetail />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}
export default App;