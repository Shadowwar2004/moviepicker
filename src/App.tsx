import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen text-black relative font-sans">
                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;