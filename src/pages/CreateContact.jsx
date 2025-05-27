import { ContactForm } from "../components/ContactForm";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CreateContact = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);

    const createContact = async (body) => {
        setIsCreating(true);
        
        console.log("=== DEBUG CREAR CONTACTO ===");
        console.log("Datos a enviar:", body);
        console.log("Datos JSON:", JSON.stringify(body));
        
        try {
            const url = "https://playground.4geeks.com/contact/agendas/Ousama/contacts";
            console.log("URL:", url);
            
            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
            });

            console.log("Status de respuesta:", response.status);
            console.log("Headers de respuesta:", response.headers);

            const responseText = await response.text();
            console.log("Respuesta cruda:", responseText);

            if (!response.ok) {

                let errorData = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    console.log("La respuesta no es JSON válido");
                }
                
                throw new Error(`Error ${response.status}: ${errorData.message || responseText || 'No se pudo crear el contacto'}`);
            }

            let newContact;
            try {
                newContact = JSON.parse(responseText);
            } catch (e) {
                console.error("Error parseando respuesta exitosa:", e);
                throw new Error("Respuesta inválida del servidor");
            }

            console.log("Contacto creado exitosamente:", newContact);
            
            dispatch({
                type: "add_contact",
                payload: { newContact }
            });
            
            navigate("/home");
        } catch (error) {
            console.error("Error completo:", error);
            alert(`Hubo un error al crear el contacto: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCancel = () => {
        navigate("/home");
    };

    return (
        <div>
            <h1>Crea un contacto nuevo</h1>
            {isCreating && (
                <div className="alert alert-info">
                    Creando contacto...
                </div>
            )}
            <ContactForm
                title={"Create new contact"}
                onSubmit={createContact}
                onCancel={handleCancel}
                disabled={isCreating}
            />
        </div>
    );
};