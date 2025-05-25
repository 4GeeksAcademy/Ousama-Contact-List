import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { CreateContact } from "./pages/CreateContact";
import { EditContact } from "./pages/EditContact";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
            <Route path="/home" element={<Home />} />
            <Route path="/create-contact" element={<CreateContact />} />
            <Route path="/edit-contact/:id" element={<EditContact />} />
        </Route>
    )
);