import React, { useEffect, useState } from "react";
import shortid from 'shortid';
import { Box } from "./Box";
import { ContactForm } from "./ContactForm";
import { ContactList } from "./ContactList";
import { Filter } from "./Filter";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const defaultContacts = [
  { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
  { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
  { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
  { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
];

export const App = () => {
  const [contacts, setContacts] = useState(() => {
    return JSON.parse(window.localStorage.getItem('contacts')) ?? defaultContacts;
  });

  useEffect(() => {
    window.localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);
    
  const [filter, setFilter] = useState('');
  const changeFilter = e => {
    setFilter(e.target.value);
  };

  const formSubmitHandler = ({ name, number }) => {
    const currentContact = { name: name, id: shortid.generate(), number: number }
    const contactDublicate = contacts.find(c => c.name === currentContact.name);
    if (contactDublicate) {
      Notify.failure(`${currentContact.name} is allready in contacts.`);
      return;
    }
    setContacts(prev => [...prev, currentContact]
    );
  };

  const normalizedFilter = filter.toLowerCase();
  const visibleContacts = contacts.filter(n => n.name.toLowerCase().includes(normalizedFilter));
  
  const deleteContact = id => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <Box
      bg="light"
      color="text"
      width="containerWidth"
      position="relative"
      p={6}
      my={0}
      mx="auto"
      boxShadow="containerShadow"
      borderRadius="normal"
      overflow="hidden"
      fontFamily="heading"
    >
      <h1>Phonebook</h1>
      <ContactForm
        onSubmit={formSubmitHandler} />
      <h2>Contacts</h2>
      <Filter
        value={filter}
        onChange={changeFilter} />
      <ContactList
        contacts={visibleContacts}
        onDeleteContact={deleteContact} />
    </Box>
  );
};