import React, { useState, useEffect, useRef } from "react";
import { ref, get, update } from "firebase/database";
import { database } from "../../firebase";
import ReactDOM from "react-dom";
import {
  UserPlus,
  X,
  Mail,
  Users,
  AlertTriangle,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";

const CollaboratorManager = ({ user, budget, colors }) => {
  const [email, setEmail] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorEmails, setCollaboratorEmails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [collaboratorToRemove, setCollaboratorToRemove] = useState(null);
  const avatarStackRef = useRef(null);

  useEffect(() => {
    if (budget.collaborators) {
      const uniqueCollaborators = [
        ...new Set(Object.keys(budget.collaborators)),
      ];
      setCollaborators(uniqueCollaborators);
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

      if (collaborators.includes(uid)) {
        setError("This user is already a collaborator.");
        setIsLoading(false);
        return;
      }

      // Update Firebase with new collaborator
      await update(
        ref(database, `budgets/${budget.owner}/${budget.id}/collaborators`),
        {
          [uid]: true,
        }
      );

      // Update local state
      setCollaborators((prev) => [...new Set([...prev, uid])]);
      setCollaboratorEmails((prev) => ({
        ...prev,
        [uid]: email,
      }));

      setEmail("");
      setError("");
      setSuccess("Collaborator added successfully!");
      setShowAddForm(false);

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
      // Remove collaborator from Firebase
      await update(ref(database), {
        [`budgets/${budget.owner}/${budget.id}/collaborators/${uid}`]: null,
      });

      // Update local state
      setCollaborators((prev) => prev.filter((id) => id !== uid));
      setCollaboratorEmails((prev) => {
        const updated = { ...prev };
        delete updated[uid];
        return updated;
      });

      setSuccess("Collaborator removed successfully!");
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

  // Compact inline view for card layout
  return (
    <div className="w-full">
      {/* Inline Collaborator Display */}
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {/* Avatar Stack or Empty State */}
          {collaborators.length > 0 ? (
            <div className="relative">
              <div ref={avatarStackRef} className="flex -space-x-2">
                {collaborators.slice(0, 3).map((uid) => (
                  <div
                    key={uid}
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all duration-200"
                    style={{
                      backgroundColor: colors.text,
                      color: colors.cardBg,
                      borderColor: colors.cardBg,
                    }}
                    title={collaboratorEmails[uid] || "Loading..."}
                  >
                    {collaboratorEmails[uid]
                      ? collaboratorEmails[uid].charAt(0).toUpperCase()
                      : "?"}
                  </div>
                ))}
                {collaborators.length > 3 && (
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: colors.secondaryText,
                      color: colors.cardBg,
                      borderColor: colors.cardBg,
                    }}
                  >
                    +{collaborators.length - 3}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Users
                className="w-4 h-4 opacity-60"
                style={{ color: colors.secondaryText }}
              />
              <span
                className="text-xs truncate"
                style={{ color: colors.secondaryText }}
              >
                No collaborators
              </span>
            </div>
          )}

          {/* Count Text for existing collaborators */}
          {collaborators.length > 0 && (
            <span
              className="text-xs truncate"
              style={{ color: colors.secondaryText }}
            >
              {collaborators.length === 1
                ? "1 collaborator"
                : `${collaborators.length} collaborators`}
            </span>
          )}
        </div>

        {/* Improved Add Button for Owner */}
        {isOwner && (
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowAddForm(true)}
              className="group relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${colors.text}20, ${colors.text}10)`,
                color: colors.text,
                border: `1px solid ${colors.text}30`,
              }}
            >
              <div className="relative">
                <Sparkles className="w-3.5 h-3.5 transition-all duration-200 group-hover:rotate-12" />
                <div
                  className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 animate-pulse"
                  style={{ backgroundColor: colors.text }}
                />
              </div>
              <span className="hidden sm:block whitespace-nowrap">
                Manage Collab
              </span>
              <span className="block sm:hidden">Manage</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Collaborator Modal */}
      {showAddForm &&
        ReactDOM.createPortal(
          <div
            style={{ backgroundColor: colors.overlay }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div
              className="rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 mx-4 max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: colors.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: `${colors.text}10` }}
                  >
                    <Sparkles
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: colors.text }}
                    />
                  </div>
                  <h3
                    className="text-base sm:text-lg font-semibold"
                    style={{ color: colors.text }}
                  >
                    Add Collaborator
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  style={{
                    color: colors.text,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.text}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Email Address
                  </label>
                  <div
                    className="relative rounded-xl border-2 transition-all duration-200 focus-within:border-opacity-80 focus-within:shadow-lg"
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
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-sm focus:outline-none"
                      style={{
                        backgroundColor: colors.surface,
                        color: colors.text,
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 flex-shrink-0" />
                      <span>{success}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:opacity-90 order-2 sm:order-1 cursor-pointer"
                    style={{
                      backgroundColor: colors.surface,
                      color: colors.text,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCollaborator}
                    disabled={isLoading || !email.trim()}
                    className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 active:scale-95 order-1 sm:order-2 cursor-pointer"
                    style={{
                      backgroundColor: email.trim()
                        ? colors.text
                        : colors.border,
                      color: email.trim()
                        ? colors.cardBg
                        : colors.secondaryText,
                    }}
                    onMouseEnter={(e) => {
                      if (email.trim() && !isLoading) {
                        e.currentTarget.style.opacity = "0.9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Add Member
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Current Collaborators List */}
              {collaborators.length > 0 && (
                <div
                  className="mt-6 pt-4 border-t"
                  style={{ borderColor: colors.border }}
                >
                  <h4
                    className="text-sm font-medium mb-3 flex items-center gap-2"
                    style={{ color: colors.text }}
                  >
                    <Users className="w-4 h-4" />
                    Team Members ({collaborators.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {collaborators.map((uid) => (
                      <div
                        key={uid}
                        className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg transition-all duration-200"
                        style={{ backgroundColor: colors.surface }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.text}05`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            colors.surface;
                        }}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <div
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0"
                            style={{
                              backgroundColor: colors.text,
                              color: colors.cardBg,
                            }}
                          >
                            {collaboratorEmails[uid]
                              ? collaboratorEmails[uid].charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span
                              className="text-xs sm:text-sm truncate"
                              style={{ color: colors.text }}
                            >
                              {collaboratorEmails[uid] || "Loading..."}
                            </span>
                            <span
                              className="text-xs opacity-60"
                              style={{ color: colors.secondaryText }}
                            >
                              Team Member
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveClick(uid)}
                          disabled={isLoading}
                          className="p-1.5 sm:p-2 rounded-full transition-all duration-200 group flex-shrink-0 cursor-pointer"
                          style={{ color: colors.secondaryText }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#fee2e2";
                            e.currentTarget.style.color = "#dc2626";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = colors.secondaryText;
                          }}
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-200" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* Confirmation Dialog */}
      {showConfirmDialog &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className="rounded-2xl shadow-xl w-full max-w-sm p-4 sm:p-6 mx-4"
              style={{ backgroundColor: colors.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-red-100 flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <h3
                  className="text-base sm:text-lg font-semibold"
                  style={{ color: colors.text }}
                >
                  Remove Member
                </h3>
              </div>

              <p
                className="text-sm mb-6"
                style={{ color: colors.secondaryText }}
              >
                Are you sure you want to remove{" "}
                <strong>
                  {collaboratorToRemove
                    ? collaboratorEmails[collaboratorToRemove] || "this member"
                    : "this member"}
                </strong>
                ? They will lose access to this budget.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={cancelRemoval}
                  className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200 order-2 sm:order-1"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.text,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoval}
                  className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-red-600 text-white active:scale-95 order-1 sm:order-2"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CollaboratorManager;
