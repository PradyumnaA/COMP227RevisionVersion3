import React from 'react';

const PersonForm = ({ newName, phoneNumber, handleName, handlePhoneNumber, addPerson }) => {
    return (
        <form onSubmit={addPerson}>
            <div>
                Name: <input value={newName} onChange={handleName} />
            </div>
            <div>
                Phone Number: <input value={phoneNumber} onChange={handlePhoneNumber} />
            </div>
            <div>
                <button type="submit">Add</button>
            </div>
        </form>
    );
}

export default PersonForm;
