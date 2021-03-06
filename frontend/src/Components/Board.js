import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import List from "./List";
import AddList from "./AddList";

const BoardWrapper = styled.section`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-flow: column;
  background-color: #3DABDE;

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
    overflow-x: scroll;
    height: 100%;
  }

`

export default function Board() {
  const [lists, setLists] = useState([])
  const [listChange, setListChange] = useState(false)

  useEffect(() => {
    axios.get("/lists")
      .then(response => {
        let data = response.data.data
        setLists(data)
      })
      .catch(e => {
        console.error(e);
      })
    return () => {
      //cancel stuff
      // cancel token.axios;
    }
  }, [])

  useEffect(() => {
    axios.get("/lists")
      .then(response => {
        let data = response.data.data
        setLists(data)
        setListChange(false)
      })
      .catch(e => {
        console.error(e);
      })
    return () => {
      //cancel stuff
      // cancel token.axios;
    }
  }, [listChange])

  return (
    <BoardWrapper>
      <div className="title-cont">
        <h1 className="board-title">EC Board</h1>

      </div>
      <section className="list-cont">
        {lists.map(list => {
          return <List listChange={setListChange} change={listChange} list={list} lists={lists} setLists={setLists} key={list._id}></List>
        })}
        <AddList lists={lists} setLists={setLists} />
      </section>

    </BoardWrapper>
  )
}