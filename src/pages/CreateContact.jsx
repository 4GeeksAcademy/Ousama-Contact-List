import { ContactForm } from "../components/ContactForm";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const CreateContact = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const createContact = async (body) => {
        try {
            const response = await fetch("https://playground.4geeks.com/contact/agendas/Ousama/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message || 'No se pudo crear el contacto'}`);
            }

            const newContact = await response.json();
            console.log("Contacto creado:", newContact);
            dispatch({
                type: "add_contact",
                payload: { newContact }
            });
            navigate("/home");
        } catch (error) {
            console.error("Error al crear contacto:", error);
            alert(`Hubo un error al crear el contacto: ${error.message}`);
        }
    };

    const handleCancel = () => {
        navigate("/home");
    };

    return (
        <div>
            <h1>Crea un contacto nuevo</h1>
            <ContactForm
                title={"Create new contact"}
                onSubmit={createContact}
                onCancel={handleCancel}
            />
        </div>
    );
};