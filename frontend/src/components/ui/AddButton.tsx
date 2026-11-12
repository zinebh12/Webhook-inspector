import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddButton = () => {
  return (
    <button
      type="submit"
      className="cursor-pointer group mt-1 flex w-full items-center justify-center gap-2 rounded-lg 
      bg-button-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 
      transition hover:bg-button-primary-hover focus:outline-none focus:ring-4 focus:ring-pink-400/30 
      active:scale-[0.99]"
    >
      Add endpoint
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
};

export default AddButton;
