import React, { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { database } from "../../firebase";
import {
  UserPlus,
  X,
  Mail,
  Users,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";

const CollaboratorManager = ({ user, budget, colors }) => {
  const [email, setEmail] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorEmails, setCollaboratorEmails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [collaboratorToRemove, setCollaboratorToRemove] = useState(null);

  useEffect(() => {
    if (budget.collaborators) {
      // Use Set to ensure unique collaborators and avoid duplicate keys
      const uniqueCollaborators = [
        ...new Set(Object.keys(budget.collaborators)),
      ];
      setCollaborators(uniqueCollaborators);

      // Fetch email addresses for all collaborators
      fetchCollaboratorEmails(uniqueCollaborators);
    } else {
      setCollaborators([]);
      setCollaboratorEmails({});
    }
  }, [budget]);

  const fetchCollaboratorEmails = async (collaboratorIds) => {
    try {
      const snapshot = await get(ref(database, "userEmails"));
      const emailMap = snapshot.val() || {};

      const emails = {};
      collaboratorIds.forEach((uid) => {
        emails[uid] = emailMap[uid] || "Unknown User";
      });

      setCollaboratorEmails(emails);
    } catch (err) {
      console.error("Error fetching collaborator emails:", err);
    }
  };

  const addCollaborator = async () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const snapshot = await get(ref(database, "userEmails"));
      const emailMap = snapshot.val() || {};
      const uid = Object.keys(emailMap).find((key) => emailMap[key] === email);

      if (!uid) {
        setError("User not found. Please check the email address.");
        setIsLoading(false);
        return;
      }

      if (uid === user.uid) {
        setError("You cannot add yourself as a collaborator.");
        setIsLoading(false);
        return;
      }

      // Check if user is already a collaborator
      if (collaborators.includes(uid)) {
        setError("This user is already a collaborator.");
        setIsLoading(false);
        return;
      }

      await update(
        ref(database, `budgets/${budget.owner}/${budget.id}/collaborators`),
        {
          [uid]: true,
        }
      );

      // Update local state with unique collaborators
      setCollaborators((prev) => [...new Set([...prev, uid])]);

      // Update collaborator emails
      setCollaboratorEmails((prev) => ({
        ...prev,
        [uid]: email,
      }));

      setEmail("");
      setSuccess("Collaborator added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add collaborator. Please try again.");
      console.error("Error adding collaborator:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCollaborator = async (uid) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await update(ref(database), {
        [`budgets/${budget.owner}/${budget.id}/collaborators/${uid}`]: null,
      });

      setCollaborators((prev) => prev.filter((id) => id !== uid));
      setCollaboratorEmails((prev) => {
        const updated = { ...prev };
        delete updated[uid];
        return updated;
      });

      setSuccess("Collaborator removed successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to remove collaborator. Please try again.");
      console.error("Error removing collaborator:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveClick = (uid) => {
    setCollaboratorToRemove(uid);
    setShowConfirmDialog(true);
  };

  const confirmRemoval = () => {
    removeCollaborator(collaboratorToRemove);
    setShowConfirmDialog(false);
    setCollaboratorToRemove(null);
  };

  const cancelRemoval = () => {
    setShowConfirmDialog(false);
    setCollaboratorToRemove(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addCollaborator();
    }
  };

  const isOwner = budget.owner === user.uid;

  return (
    <div
      style={{ marginTop: "-18px" }}
      className="w-full max-w-4xl mx-auto sm:px-4"
    >
      <div
        className="rounded-2xl transition-all duration-300 hover:shadow-md"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 sm:p-5 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.surface }}
            >
              <Users
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: colors.text }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <h3
                className="font-semibold text-base sm:text-lg"
                style={{ color: colors.text }}
              >
                Collaborators
              </h3>
              {collaborators.length > 0 && (
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: colors.text,
                    color: colors.cardBg,
                  }}
                >
                  {collaborators.length}
                </span>
              )}
            </div>
          </div>
          <div className="transition-transform duration-300">
            {isExpanded ? (
              <ChevronUp
                className="w-5 h-5 transform rotate-0 transition-transform duration-300"
                style={{ color: colors.text }}
              />
            ) : (
              <ChevronDown
                className="w-5 h-5 transform rotate-0 transition-transform duration-300"
                style={{ color: colors.text }}
              />
            )}
          </div>
        </div>

        {/* Expandable Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
            <div
              className="border-t pt-4 space-y-4"
              style={{ borderColor: colors.border }}
            >
              {/* Add Collaborator Section (Owner Only) */}
              {isOwner && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 transform transition-all duration-300 ease-out">
                    <div className="flex-1 transform transition-all duration-300 delay-100">
                      <div
                        className="relative rounded-xl border-2 transition-all duration-200 focus-within:border-opacity-80 hover:shadow-sm"
                        style={{ borderColor: colors.border }}
                      >
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                          style={{ color: colors.secondaryText }}
                        />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Enter collaborator's email"
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                          style={{
                            backgroundColor: colors.surface,
                            color: colors.text,
                          }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={addCollaborator}
                      disabled={isLoading || !email.trim()}
                      className="px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 hover:opacity-90 active:scale-95 whitespace-nowrap transform hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: email.trim()
                          ? colors.text
                          : colors.border,
                        color: email.trim()
                          ? colors.cardBg
                          : colors.secondaryText,
                      }}
                    >
                      {isLoading ? "Adding..." : "Add Collaborator"}
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="space-y-2">
                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 transform transition-all duration-300 animate-in slide-in-from-top-2">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 transform transition-all duration-300 animate-in slide-in-from-top-2">
                        {success}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Collaborators List */}
              <div className="space-y-3 transform transition-all duration-300 delay-200">
                <h4
                  className="text-sm font-medium transition-all duration-300"
                  style={{ color: colors.secondaryText }}
                >
                  Current Collaborators
                </h4>
                {collaborators.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {collaborators.map((uid, index) => (
                      <div
                        key={uid}
                        className="flex items-center justify-between p-3 rounded-xl border transition-all duration-300 hover:shadow-md hover:scale-105 transform"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110"
                            style={{ backgroundColor: colors.border }}
                          >
                            <Mail
                              className="w-4 h-4 transition-all duration-200"
                              style={{ color: colors.text }}
                            />
                          </div>
                          <span
                            className="text-sm truncate transition-all duration-200"
                            style={{ color: colors.text }}
                            title={collaboratorEmails[uid] || "Loading..."}
                          >
                            {collaboratorEmails[uid] || "Loading..."}
                          </span>
                        </div>
                        {isOwner && (
                          <button
                            onClick={() => handleRemoveClick(uid)}
                            disabled={isLoading}
                            className="ml-2 p-1.5 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:scale-110 flex-shrink-0 active:scale-95"
                            style={{ color: colors.secondaryText }}
                            title="Remove collaborator"
                          >
                            <X className="w-4 h-4 transition-all duration-200" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-8 rounded-xl border-2 border-dashed transition-all duration-300 hover:border-solid hover:shadow-sm"
                    style={{ borderColor: colors.border }}
                  >
                    <Users
                      className="w-12 h-12 mx-auto mb-3 opacity-50 transition-all duration-300 hover:opacity-70 hover:scale-110"
                      style={{ color: colors.secondaryText }}
                    />
                    <p
                      className="text-sm transition-all duration-300"
                      style={{ color: colors.secondaryText }}
                    >
                      No collaborators yet
                    </p>
                    {isOwner && (
                      <p
                        className="text-xs mt-1 transition-all duration-300"
                        style={{ color: colors.secondaryText }}
                      >
                        Add someone to start collaborating
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform transition-all duration-300 scale-100 animate-in zoom-in-95 slide-in-from-bottom-4"
            style={{ backgroundColor: colors.cardBg }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-full bg-red-100 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                Remove Collaborator
              </h3>
            </div>

            <p
              className="text-sm mb-6 transition-all duration-300"
              style={{ color: colors.secondaryText }}
            >
              Are you sure you want to remove{" "}
              <strong className="transition-all duration-300">
                {collaboratorToRemove
                  ? collaboratorEmails[collaboratorToRemove] ||
                    "this collaborator"
                  : "this collaborator"}
              </strong>
              ? They will lose access to this budget and won't be able to make
              any changes.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={cancelRemoval}
                className="flex-1 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoval}
                className="flex-1 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95 bg-red-600 text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorManager;
