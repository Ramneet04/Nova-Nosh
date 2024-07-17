import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import {Outlet} from "react-router-dom";


function App() {
  return (
    <div className="min-h-screen flex flex-wrap content-between">  
    <div className="w-full block">
      <Header />
      <main>
          <Outlet/>
        </main>
      <Footer />
    </div>
    </div>
  );
}

export default App;