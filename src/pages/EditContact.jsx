import { ContactForm } from "../components/ContactForm";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";

export const EditContact = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [selectedContact, setSelectedContact] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("=== DEBUG EDIT CONTACT ===");
        console.log("ID del URL:", id);
        console.log("Contactos en store:", store.contacts);
        console.log("Cantidad de contactos:", store.contacts.length);
        
        if (store.contacts.length > 0) {
            
            console.log("IDs disponibles:");
            store.contacts.forEach((contact, index) => {
                console.log(`Contacto ${index}:`, {
                    _id: contact._id,
                    id: contact.id,
                    name: contact.name
                });
            });
            
            let foundContact = store.contacts.find(contact => contact._id === id);
            console.log("Contacto encontrado por _id:", foundContact);
            
            if (!foundContact) {
                foundContact = store.contacts.find(contact => contact.id === id);
                console.log("Contacto encontrado por id:", foundContact);
            }
            
            if (!foundContact) {
                foundContact = store.contacts.find(contact => contact.id === parseInt(id));
                console.log("Contacto encontrado por id (número):", foundContact);
            }
            
            if (!foundContact) {
                foundContact = store.contacts.find(contact => contact._id === parseInt(id));
                console.log("Contacto encontrado por _id (número):", foundContact);
            }
            
            if (foundContact) {
                setSelectedContact(foundContact);
                setIsLoading(false);
            } else {
                setError("Contacto no encontrado en la lista.");
                setIsLoading(false);
            }
        } else {
            setError("No se pudieron cargar los contactos. Intenta volver a la página de inicio y luego editar.");
            setIsLoading(false);
        }
    }, [id, store.contacts]);

    const editContact = async (body) => {
        console.log("=== DEBUG EDITAR CONTACTO ===");
        console.log("ID para editar:", id);
        console.log("Datos a enviar:", body);
        
        try {
            const url = `https://playground.4geeks.com/contact/agendas/Ousama/contacts/${id}`;
            console.log("URL de edición:", url);
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            console.log("Status de respuesta:", response.status);
            
            const responseText = await response.text();
            console.log("Respuesta cruda:", responseText);

            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    console.log("La respuesta de error no es JSON válido");
                }
                throw new Error(`Error ${response.status}: ${errorData.message || responseText || 'No se pudo editar el contacto'}`);
            }

            let updatedContact;
            try {
                updatedContact = JSON.parse(responseText);
            } catch (e) {
                console.error("Error parseando respuesta exitosa:", e);
                throw new Error("Respuesta inválida del servidor");
            }

            console.log("Contacto actualizado:", updatedContact);
            
            dispatch({
                type: "update_contact",
                payload: { updatedContact }
            });
            navigate("/home");
        } catch (err) {
            console.error("Error al editar contacto:", err);
            alert(`Hubo un error al editar el contacto: ${err.message}`);
        }
    };

    const handleCancel = () => {
        navigate("/home");
    };

    if (isLoading) {
        return <div className="text-center mt-5">Cargando contacto...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    }

    if (!selectedContact) {
        return <div className="text-center mt-5">Contacto no encontrado. Asegúrate de que el ID es correcto.</div>;
    }

    return (
        <div>
            <h1>Editar Contacto</h1>
            <ContactForm
                title={'Edit Contact'}
                onSubmit={editContact}
                storeName={selectedContact.name}
                storePhone={selectedContact.phone}
                storeEmail={selectedContact.email}
                storeAddress={selectedContact.address}
                onCancel={handleCancel}
            />
        </div>
    );
};