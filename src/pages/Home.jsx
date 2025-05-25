import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { Card } from "../components/Card.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await fetch(
          "https://playground.4geeks.com/contact/agendas/Ousama/contacts"
        );
        if (!response.ok) throw new Error("Error en la solicitud");
        const data = await response.json();
        dispatch({
          type: "load_contacts",
          payload: {
            contacts: data.contacts || [],
          },
        });
        console.log("Contactos cargados", data.contacts);
      } catch (error) {
        console.error("Error obteniendo contactos:", error);
        dispatch({
          type: "load_contacts",
          payload: {
            contacts: [],
          },
        });
      }
    };
    getContacts();
  }, [dispatch]);

  const deleteContact = async (id) => {
    try {
      const response = await fetch(
        `https://playground.4geeks.com/contact/agendas/Ousama/contacts/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        dispatch({ type: "delete_contact", payload: { id } });
        console.log(`Contacto con ID: ${id} eliminado exitosamente.`);
      } else {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.message || 'No se pudo eliminar el contacto'}`);
      }
    } catch (error) {
      console.error("Error eliminando contacto:", error);
      alert(`Hubo un error al eliminar el contacto: ${error.message}`);
    }
  };

  return (
    <div className="text-center mt-5">
      {store.contacts.length === 0 ? (
        <p>No hay contactos. ¡Crea uno nuevo!</p>
      ) : (
        store.contacts.map((contact) => (
          <Card
            key={contact._id}
            name={contact.name}
            image={rigoImageUrl}
            id={contact._id}
            phone={contact.phone}
            email={contact.email}
            address={contact.address}
            onEdit={() => navigate(`/edit-contact/${contact._id}`)}
            onDelete={() => deleteContact(contact._id)}
          />
        ))
      )}
    </div>
  );
};