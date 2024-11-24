import React from "react";

const UsersItem = ({
  id,
  username,
  name,
  surname,
  country,
  city,
  street,
  phone
}) => {
  return (
    <div className="usersItem">
      <div className="userItemColl">{username}</div>
      <div className="userItemColl">{name}</div>
      <div className="userItemColl">{surname}</div>
      <div className="userItemColl">{country}</div>
      <div className="userItemColl">{city}</div>
      <div className="userItemColl">{street}</div>
      <div className="userItemColl">{phone}</div>
    </div>
  );
};

export default UsersItem;
