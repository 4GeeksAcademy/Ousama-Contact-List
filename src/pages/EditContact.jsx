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
        const loadContact = async () => {
            setIsLoading(true);
            setError(null);
            let foundContact = store.contacts.find(contact => contact._id === id);

            if (!foundContact) {
                try {
                    const response = await fetch("https://playground.4geeks.com/contact/agendas/Ousama/contacts"); 
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Error ${response.status}: ${errorData.message || 'No se pudieron cargar los contactos.'}`);
                    }
                    const data = await response.json();
                    const allContacts = data.contacts || [];

                    dispatch({
                        type: "load_contacts",
                        payload: { contacts: allContacts }
                    });

                    foundContact = allContacts.find(contact => contact._id === id);

                    if (!foundContact) {
                        throw new Error("El contacto no fue encontrado después de la recarga.");
                    }
                } catch (err) {
                    console.error("Error al recargar contactos para edición:", err);
                    setError(err.message);
                    setIsLoading(false);
                    return;
                }
            }
            
            setSelectedContact(foundContact);
            setIsLoading(false);
        };

        loadContact();
    }, [id, store.contacts, dispatch]);

    const editContact = async (body) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/contact/agendas/Ousama/contacts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message || 'No se pudo editar el contacto'}`);
            }

            const updatedContact = await response.json();
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