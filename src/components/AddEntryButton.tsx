import React from 'react';

interface AddEntryButtonProps {
  onAdd: () => void;
}

const AddEntryButton: React.FC<AddEntryButtonProps> = ({ onAdd }) => {
  return (
    <button
      onClick={onAdd}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add New Entry
    </button>
  );
};

export default AddEntryButton;