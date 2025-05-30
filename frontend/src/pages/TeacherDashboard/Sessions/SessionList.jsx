import React from "react";
import SessionCard from "./components/SessionCard";

const SessionList = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return <p className="text-gray-600 text-center py-10">You have no sessions scheduled yet.</p>;
  }
  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <SessionCard key={session._id} session={session} />
      ))}
    </div>
  );
};
export default SessionList;