const FormButton = ({ BtnFunction }: { BtnFunction: string }) => {
  return (
    <button
      type="submit"
      className="cursor-pointer group mt-1 flex w-full items-end justify-center gap-2 rounded-lg bg-button-primary px-4 py-3 text-sm font-semibold text-text-primary shadow-lg shadow-pink-950/40 transition hover:bg-button-primary-hover focus:outline-none focus:ring-4 focus:ring-pink-400/30 active:scale-[0.99]"
    >
      {BtnFunction}
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4 transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      >
        <path
          d="M4 10H16M10 4L16 10L10 16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default FormButton;
