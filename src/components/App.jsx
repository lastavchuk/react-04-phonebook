import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Filter } from './Filter/Filter';
import { Section } from './Section/Section';
import { Container } from './Container/Container';
import { ContactList } from './Contacts/ContactList';
import { FormAddContact } from './Forms/FormAddContact';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { HeadTilte } from './HeadTilte/HeadTilte';

export function App() {
    const [contacts, setContacts] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        try {
            const getContacts = JSON.parse(localStorage.getItem('contacts'));

            if (!!getContacts) {
                setContacts(getContacts);
            }
        } catch (error) {
            Notify.failure(`Someting wrong!</br><b>${error.message}</b>`, {
                plainText: false,
            });
        }
    }, []);

    useEffect(() => {
        if (!!contacts.length)
            localStorage.setItem('contacts', JSON.stringify(contacts));
    }, [contacts]);

    const onAddContact = contactData => {
        const newContact = { id: nanoid(), ...contactData };

        const findUser = contacts.find(
            el => el.name === newContact.name.trim()
        );

        if (findUser) {
            Notify.warning(`<b>${findUser.name}</b> is already in contacts`, {
                plainText: false,
            });
            return;
        }

        setContacts(prevState => [newContact, ...prevState]);
    };

    const onRemoveContact = contactId => {
        setContacts(prevState =>
            prevState.filter(contact => contact.id !== contactId)
        );
    };

    const onFilter = filterTerm => {
        setFilter(filterTerm);
    };

    const filteredContacts = () => {
        if (!!filter) {
            return contacts.filter(contact => {
                return (
                    contact.name
                        .toLowerCase()
                        .includes(filter.toLowerCase().trim()) ||
                    contact.number.includes(filter.trim())
                );
            });
        }
        return contacts;
    };

    return (
        <>
            <Section>
                <Container>
                    <HeadTilte title="Phonebook" />
                    <FormAddContact onAddContact={onAddContact} />
                </Container>
            </Section>
            {contacts.length ? (
                <Section>
                    <Container>
                        <HeadTilte title="Contacts" />
                        <Filter filter={filter} onFilterChange={onFilter} />
                        <ContactList
                            contacts={filteredContacts()}
                            onRemoveContact={onRemoveContact}
                        />
                    </Container>
                </Section>
            ) : (
                <Section>
                    <Container>
                        <HeadTilte title="No contacts" />
                    </Container>
                </Section>
            )}
        </>
    );
}
