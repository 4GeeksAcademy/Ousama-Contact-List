export const initialStore = () => {
    return {
        contacts: []
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case 'load_contacts': {
            const { contacts } = action.payload;
            return {
                ...store,
                contacts: contacts.map(contact => ({
                    name: contact.name,
                    address: contact.address,
                    phone: contact.phone,
                    email: contact.email,
                    _id: contact._id || contact.id
                }))
            };
        }

        case 'delete_contact': {
            const { id } = action.payload;
            const newContacts = store.contacts.filter(contact => contact._id !== id);
            return {
                ...store,
                contacts: newContacts
            };
        }

        case 'add_contact': {
            const { newContact } = action.payload;
            return {
                ...store,
                contacts: [...store.contacts, {
                    name: newContact.name,
                    address: newContact.address,
                    phone: newContact.phone,
                    email: newContact.email,
                    _id: newContact._id || newContact.id
                }]
            };
        }

        case 'update_contact': {
            const { updatedContact } = action.payload;
            const newContacts = store.contacts.map(contact =>
                contact._id === (updatedContact._id || updatedContact.id)
                    ? {
                        ...contact,
                        name: updatedContact.name,
                        address: updatedContact.address,
                        phone: updatedContact.phone,
                        email: updatedContact.email,
                    }
                    : contact
            );
            return {
                ...store,
                contacts: newContacts
            };
        }

        default:
            return store;
    }
}