import React from "react";
import { Container, Row } from "react-bootstrap";
import TopBar from "../Component/TopBar.tsx";
import List from "./List.tsx";
import Board from "./Board.tsx";
import CreateTask from "../Component/CreateTask.tsx";

const Home = () => {
 
  return (
    <Container fluid>
     
      <Row>
        <List />
       
      </Row>
    </Container>
  );
};

export default Home;
