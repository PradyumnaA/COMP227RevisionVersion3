// App.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from './services/persons.js';
import './index.css';

// eslint-disable-next-line react/prop-types
const Form = ({ newName, phoneNumber, handleName, handlePhoneNumber, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                Name: <input type="text" value={newName} onChange={handleName} />
            </div>
            <div>
                Phone Number: <input type="text" value={phoneNumber} onChange={handlePhoneNumber} />
            </div>
            <div>
                <button type="submit">Add</button>
            </div>
        </form>
    );
};

// eslint-disable-next-line react/prop-types
const Input = ({ type, placeholder, value, onChange }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

// eslint-disable-next-line react/prop-types
const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className={type === 'success' ? 'success' : 'error'}>
            {message}
        </div>
    );
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [notificationType, setNotificationType] = useState('');

    useEffect(() => {
        getAll().then(response => {
            setPersons(response.data);
        });
    }, []);

    const handleName = (event) => {
        setNewName(event.target.value);
    };

    const handlePhoneNumber = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const addPerson = (event) => {
        event.preventDefault();
        const personObject = {
            name: newName,
            phone: phoneNumber,
        };

        const existingPerson = persons.find(person => person.name === newName);

        if (existingPerson) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                update(existingPerson.id, personObject)
                    .then(response => {
                        setPersons(persons.map(person =>
                            person.id === existingPerson.id ? response.data : person
                        ));
                        setNewName('');
                        setPhoneNumber('');
                        setNotificationMessage(`${newName}'s phone number replaced`);
                        setNotificationType('success');
                        setTimeout(() => {
                            setNotificationMessage(null);
                        }, 5000);
                    })
                    .catch(error => {
                        console.error('Error updating person:', error);
                        setNotificationMessage('Error updating person');
                        setNotificationType('error');
                        setTimeout(() => {
                            setNotificationMessage(null);
                        }, 5000);
                    });
            }
        } else {
            create(personObject)
                .then(response => {
                    setPersons(persons.concat(response.data));
                    setNewName('');
                    setPhoneNumber('');
                    setNotificationMessage(`${newName} added to phonebook`);
                    setNotificationType('success');
                    setTimeout(() => {
                        setNotificationMessage(null);
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error adding person:', error);
                    setNotificationMessage('Error adding person');
                    setNotificationType('error');
                    setTimeout(() => {
                        setNotificationMessage(null);
                    }, 5000);
                });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this person?')) {
            remove(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id));
                    setNotificationMessage('Person deleted');
                    setNotificationType('success');
                    setTimeout(() => {
                        setNotificationMessage(null);
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error deleting person:', error);
                    setNotificationMessage('Error deleting person');
                    setNotificationType('error');
                    setTimeout(() => {
                        setNotificationMessage(null);
                    }, 5000);
                });
        }
    };

    const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notificationMessage} type={notificationType} />
            <Form
                newName={newName}
                phoneNumber={phoneNumber}
                handleName={handleName}
                handlePhoneNumber={handlePhoneNumber}
                onSubmit={addPerson}
            />

            <div>
                <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <h2>Numbers</h2>
            <ul>
                {filteredPersons.map(person =>
                    <li key={person.id}>
                        {person.name} {person.phone}
                        <button onClick={() => handleDelete(person.id)}>Delete</button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default App;
