import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Auth from "./pages/Auth/Auth";
import LogIn from "./components/Login/Login";
import Home from "./pages/Home/Home";
import Question from "./pages/Question/Question";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import Answer from "./pages/Answer/Answer";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* landing page */}
        <Route path="/" element={<Layout />}>
          {/* Home page Route */}
          <Route path="/" element={<Auth />}>
            <Route index element={<LogIn />} />
          </Route>

          <Route path="/home" element={<Home />} />
          {/* Question page Route */}
          <Route path="/question" element={<Question />} />
          {/* Answer page Route */}
          <Route path="/answer/:question_id" element={<Answer />} />
          {/* How It Works Page Route */}
          <Route path="/howItWorks" element={<HowItWorks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
