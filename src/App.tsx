import './App.css'
import { Header } from './layouts/header'
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "@/routes";

function AppRouter() {
  const routing = useRoutes(routes);
  return routing;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
            <Header />
            <AppRouter />
          </div>
      </BrowserRouter>
    </>
  )
}

export default App
