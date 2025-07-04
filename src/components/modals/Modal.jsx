import React from "react";

const Modal = ({
  modalOpen,
  setModalOpen,
  confirmAction,
  modalTitle,
  modalMessage,
  colors,
}) => {
  return (
    <>
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{
            backgroundColor: colors.overlay, // uses your theme’s overlay
          }}
        >
          <div
            className="p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full border-2 transform scale-100 animate-scale-in transition-all"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
            }}
          >
            <h2
              className="text-lg sm:text-xl font-bold mb-3"
              style={{ color: colors.text }}
            >
              {modalTitle}
            </h2>

            {modalMessage && (
              <p
                className="text-sm mb-6 opacity-90"
                style={{ color: colors.text }}
              >
                {modalMessage}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              {/* Cancel Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 rounded-xl font-medium hover:shadow-md transform hover:scale-105 transition-all duration-300 text-sm sm:text-base border cursor-pointer"
                style={{
                  backgroundColor: colors.cardBg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                Cancel
              </button>

              {/* Confirm / Sign Out Button */}
              <button
                onClick={() => {
                  confirmAction();
                  setModalOpen(false);
                }}
                className="px-6 py-3 rounded-xl font-medium hover:shadow-md transform hover:scale-105 transition-all duration-300 text-sm sm:text-base border cursor-pointer"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                {modalTitle === "Sign Out" ? "Sign Out" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
