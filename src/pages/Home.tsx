import React from "react";
import Chat from "../components/Chat";
import Settings from "../components/Settings";

const Home: React.FC = () => {
  return (
    <div>
      <Chat />
      <Settings />
    </div>
  );
};

export default Home;
