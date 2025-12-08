import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import Preference from "./pages/Preference";
import Problem from "./pages/Problem";
import Review from "./pages/Review";

const router = createMemoryRouter([
  {
    path: "/",
    element: <Review />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/preference",
    element: <Preference />,
  },
  {
    path: "/problem",
    element: <Problem />,
  },
]);

function ActionApp() {
  return (
    <RouterProvider router={router} />
  )
}

export default ActionApp
