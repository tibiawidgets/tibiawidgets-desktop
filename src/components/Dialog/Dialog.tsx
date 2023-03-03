export type DialogProps = {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
};

const Dialog: React.FC<DialogProps> = ({
  title,
  isOpen = false,
  children,
}: DialogProps) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75 z-1">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg overflow-hidden shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
