import React, { Component } from "react";
import shortid from 'shortid';
import { Box } from "./Box";
import { ContactForm } from "./ContactForm";
import { ContactList } from "./ContactList";
import { Filter } from "./Filter";
import { Notify } from 'notiflix/build/notiflix-notify-aio';


export class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  }

  //Виполняется каждій раз при первой загрузке страниці
  //Можна повесить слушателя на window
  componentDidMount() {
    const contactsFromLS = JSON.parse(localStorage.getItem('contacts'));
    if (contactsFromLS) {
      this.setState({ contacts: contactsFromLS });
    }
  }

  //Віполняется каждій раз при обновлении стейта до рендера
  componentDidUpdate(_, prevState) {

    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  }

  formSubmitHandler = ({ name, number }) => {
    const currentContact = { name: name, id: shortid.generate(), number: number }
    const contactDublicate = this.state.contacts.find(c => c.name === currentContact.name);
    if (contactDublicate) {
      Notify.failure(`${currentContact.name} is allready in contacts.`);
      return;
    }
      this.setState(prevState => ({
        contacts: [currentContact, ...prevState.contacts]
      }));
  };

  deleteContact = (contactId) => {
    console.log('contactId:', contactId);
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId)
    }))
  }

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();
    
    return contacts.filter(n => n.name.toLowerCase().includes(normalizedFilter));
  }
  

  render() {
    console.log('App render');
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();
    
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
        <ContactForm onSubmit={this.formSubmitHandler}/>
        <h2>Contacts</h2>
        <Filter value={filter} onChange={this.changeFilter}/>
        <ContactList contacts={visibleContacts} onDeleteContact={this.deleteContact}/>
      </Box>
    ); 
  }
}
