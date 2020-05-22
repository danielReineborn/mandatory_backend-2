import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Card from "./Card";
import AddCard from "./AddCard";
import MenuBtn from "./MenuBtn";

const ListWrapper = styled.div`
  margin: 16px 0px 0px 8px;
  height: fit-content;
  width: 250px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  background-color: #E5EFF5;
  border: 1px solid #E5EFF5;
  border-radius: 4px;

  .cont {
    width: 90%;
    margin: 4px 0 4px;
    display: flex;
    justify-content: space-between;

  }
  .list-title {
    font-weight: bold;
    font-size: 14px;
  }
`

export default function List({ listChange, change, list, setLists, lists }) {
  const [cards, setCards] = useState([]);
  const [isClicked, setIsClicked] = useState(false);


  useEffect(() => {
    axios.get(`/cards/${list._id}`)
      .then(response => {
        console.log(response.data.data);
        let data = response.data.data
        setCards(data)
        listChange(false);


      })
    return () => {
      //cancel listener
    }
  }, [list._id, change])



  return (
    <>
      <ListWrapper>
        <div className="cont">
          <p className="list-title">{list.name}</p>
        </div>
        {cards.map(card => {
          return <Card change={listChange} lists={lists} card={card} key={card._id}></Card>;
        })}
        <AddCard cards={cards} setCards={setCards} listId={list._id} />
      </ListWrapper>
      <MenuBtn
        lists={lists}
        setLists={setLists}
        isClicked={isClicked}
        updateClick={setIsClicked}
        type={"list"}
        id={list._id}
        icon={"..."}
      />
    </>
  )
}