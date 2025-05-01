import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

type UpdateInfoModalProps = {
  onClose: () => void;
  user?: {
    fullName: string;
    profileImageUrl?: string;
  };
};

export default function UpdateInfoModal({ onClose, user }: UpdateInfoModalProps) {
  const { user: clerkUser } = useUser();

  const [firstName, setFirstName] = useState(() => user?.fullName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(() => user?.fullName?.split(' ').slice(1).join(' ') || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkUser) return;
  
    setLoading(true);
    try {
      const updatedData: { firstName?: string; lastName?: string } = {};
  
      // Only include name fields if they're not empty
      if (firstName) {
        updatedData.firstName = firstName;
      }
  
      if (lastName) {
        updatedData.lastName = lastName;
      }
  
      // Update name fields only if they're included in updatedData
      if (Object.keys(updatedData).length > 0) {
        await clerkUser.update(updatedData);
      }
  
      // Update profile image only if selected
      if (profileImage) {
        const imageUrl = await clerkUser.setProfileImage({ file: profileImage });
        console.log('Profile image updated:', imageUrl);
      }
  
      onClose(); // Close the modal after update
    } catch (err) {
      console.error('Failed to update user:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="text-lg font-medium mb-4">Update Profile</Dialog.Title>
              <form className="space-y-4" onSubmit={handleUpdate}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files ? e.target.files[0] : null)}
                    className="w-full border p-2 rounded"
                  />
                  {profileImage && (
                    <p className="text-sm text-green-600 mt-1">New image selected</p>
                  )}
                  {user?.profileImageUrl && !profileImage && (
                    <div className="mt-1 flex items-center">
                      <img 
                        src={user.profileImageUrl} 
                        alt="Current profile" 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="ml-2 text-sm text-gray-500">Current profile image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || (!firstName && !lastName && !profileImage)}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}