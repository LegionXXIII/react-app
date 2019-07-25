import React from "react";

const Profile = ({ user }) => {
  return (
    <div className="jumbotron jumbotron-flui">
      <div className="container">
        <h1 className="display-4">{user && user.name}</h1>
        <p className="lead">{user && user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
