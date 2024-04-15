import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import Main from "./layouts/Main";
function App() {

  return (
    <>
      <Routes>
        <Route element={<Main />}>
          <Route path="/" element={<Home />} />
          <Route path="/weather/:city?" element={<Weather />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
