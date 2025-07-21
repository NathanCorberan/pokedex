import type { RouteObject } from "react-router-dom";
import { Home } from "@/pages/home/home";
import { FavorisPage } from "@/pages/favoris/favoris-page";
import { TypesPage } from "@/pages/types/TypesPage";
import { TypeDetailPage } from "@/pages/types/TypeDetailPage"

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/favoris",
    element: <FavorisPage  />,
  },
  {
    path: "/types",
    element: <TypesPage  />,
  },
   {
    path: "/types/:typeName",
    element: <TypeDetailPage />,
  },
];