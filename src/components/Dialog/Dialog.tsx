export type DialogProps = {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: () => void;
};

const Dialog: React.FC<DialogProps> = ({
  onClose,
  title,
  isOpen = false,
  children,
  onSubmit,
}: DialogProps) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75 z-1">
      <div className="flex items-center justify-center min-h-screen">
        <form className="bg-white rounded-lg overflow-hidden shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div>{children}</div>
          <button
            type="button"
            className="bg-red-500 text-white rounded py-2 px-4 hover:bg-red-700 mr-5"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700"
            onClick={onSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dialog;
