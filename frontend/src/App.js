import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MorsePage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      	<Routes>
			<Route path="/" element={<MorsePage />} />
		</Routes>
    </BrowserRouter>
  );
}

export default App;
