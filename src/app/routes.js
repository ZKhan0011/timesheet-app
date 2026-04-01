import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { TimeEntry } from "./pages/TimeEntry";
import { Timesheets } from "./pages/Timesheets";
import { Reports } from "./pages/Reports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "time-entry", Component: TimeEntry },
      { path: "timesheets", Component: Timesheets },
      { path: "reports", Component: Reports },
    ],
  },
]);
