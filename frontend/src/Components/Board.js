import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import List from "./List";
import AddList from "./AddList";

const BoardWrapper = styled.section`
  height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-flow: column;
  background-color: #3DABDE;
  overflow: auto;

  .title-cont {
    width: 125px;
    margin: 25px;
    padding: 10px;
    background-color: #319CC9;
    border-radius: 8px;
  }
  
  .board-title {
    margin: 0px;
    color: #ffffff;
    text-align: center; 
  }

  .list-cont {
    display: flex;
    justify-content: flex-start;
    overflow: auto;
    min-height: 450px;
  }

`

export default function Board() {
  const [lists, setLists] = useState([])
  useEffect(() => {
    axios.get("/lists")
      .then(response => {
        let data = response.data.data
        setLists(data)

        return () => {
          //cancel stuff
          // cancel token.axios;
        }
      })
  }, [])

  return (
    <BoardWrapper>
      <div className="title-cont">
        <h1 className="board-title">EC Board</h1>

      </div>
      <section className="list-cont">
        {lists.map(list => {
          return <List list={list} lists={lists} setLists={setLists} key={list._id}></List>
        })}
        <AddList lists={lists} setLists={setLists} />
      </section>

    </BoardWrapper>
  )
}