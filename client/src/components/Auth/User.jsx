import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';

function UpdateName() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const updateName = async () => {
    try {
      await user.update({
        first_name: firstName,
        last_name: lastName
      });
      alert('Name updated!');
    } catch (err) {
      console.error('Error updating name:', err);
      alert('Failed to update name.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />
      <button onClick={updateName}>Update Name</button>
    </div>
  );
}

export default UpdateName;
