import React, { useState } from "react";
import { IClubInput } from "@/lib/models/Club";
import Image from "next/image";

interface ClubLeader {
  email: string;
  name: string;
  year?: number;
  role?: string;
  netId?: string;
  profilePicture?: string;
}

const ClubLeadersSection: React.FC<{
  leaders: ClubLeader[];
  handleChange: (field: keyof IClubInput, value: ClubLeader[] | undefined) => void;
}> = ({ leaders, handleChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLeader, setCurrentLeader] = useState<ClubLeader>({
    email: "",
    name: "",
    year: 0,
    role: "",
    netId: "",
    profilePicture: "",
  });

  const openModal = (leader?: ClubLeader, index?: number) => {
    if (leader && typeof index === "number") {
      setCurrentLeader(leader);
      setSelectedIndex(index);
      setIsEditing(true);
    } else {
      setCurrentLeader({
        email: "",
        name: "",
        year: 0,
        role: "",
        netId: "",
        profilePicture: "",
      });
      setIsEditing(false);
    }
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentLeader({
      email: "",
      name: "",
      year: 0,
      role: "",
      netId: "",
      profilePicture: "",
    });
    setSelectedIndex(null);
    setIsEditing(false);
    setError(null);
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!currentLeader.email) {
      setError("Email is mandatory");
      return;
    }
    if (!currentLeader.name) {
      setError("Name is mandatory");
      return;
    }
    const updatedLeaders = [...leaders];
    if (isEditing && typeof selectedIndex === "number") {
      updatedLeaders[selectedIndex] = currentLeader;
    } else {
      updatedLeaders.push(currentLeader);
    }
    handleChange("leaders", updatedLeaders);
    closeModal();
  };

  const handleDelete = (index: number) => {
    const updatedLeaders = leaders.filter((_, i) => i !== index);
    handleChange("leaders", updatedLeaders);
  };

  return (
    <div>
      <p className="block text-sm font-medium text-gray-700 mb-2">Board</p>
      <ul className="mb-2">
        {leaders.map((leader, index) => (
          <li key={index} className="flex items-center p-1 rounded-lg mb-2 hover">
            <div>
              <p className="font-medium">{leader.name || "Unnamed Board Member"}</p>
              <p className="text-sm text-gray-600">Role: {leader.role || "Not Specified"}</p>
            </div>
            <div className="ml-auto flex space-x-1">
              <button
                onClick={() => openModal(leader, index)}
                className="bg-gray-300 text-white py-1 px-3 rounded-lg hover:bg-gray-400"
              >
                <div className="w-4 h-4">
                  <Image
                    src="/assets/edit-3-svgrepo-com.svg"
                    alt="Edit Icon"
                    width={24}
                    height={24}
                    className="w-full h-full"
                  />
                </div>
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
              >
                <div className="w-4 h-4">
                  <Image
                    src="/assets/cross-svgrepo-com (1).svg"
                    alt="Edit Icon"
                    width={24}
                    height={24}
                    className="w-full h-full"
                  />
                </div>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => openModal()} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
        Add Board Member
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{isEditing ? "Edit Leader" : "Add New Leader"}</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <p className="text-sm text-gray-500 mb-4">
              Fields marked with <span className="text-red-500">*</span> are required.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> Name
                <input
                  type="text"
                  value={currentLeader.name}
                  onChange={(e) => setCurrentLeader((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Peter Salovey"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> Yale Email
                <input
                  type="email"
                  value={currentLeader.email}
                  onChange={(e) => setCurrentLeader((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="peter.salovey@yale.edu"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Role
                <input
                  type="text"
                  value={currentLeader.role}
                  onChange={(e) => setCurrentLeader((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="President"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Year
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={currentLeader.year || ""}
                  onChange={(e) =>
                    setCurrentLeader((prev) => ({
                      ...prev,
                      year: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="1983"
                />
              </label>
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={closeModal} className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleSave} className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {isEditing ? "Save Changes" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubLeadersSection;
