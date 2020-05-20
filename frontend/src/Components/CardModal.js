import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import moment from "moment";
import axios from "axios";

const ModalWrapper = styled.section`
  z-index: 1;
  height: 500px;
  width: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10%;
  left: calc(50% - 200px);
  background-color: #f4f5f7;
  border-radius: 4px;


  .main-view {
    height: 100%;
    width: 80%;
    margin: auto;
  }

  .btn-exit {

  }

  .cont {
    min-height: 175px;
    width: 100%;

  }

`
const Backdrop = styled.div`
  z-index: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0
`

export default function CardModal({ listId, card, open, close, todoChange, todos }) {
  const [desc, setDesc] = useState("");
  const [todo, setTodo] = useState("");
  const [showDesc, setShowDesc] = useState(false);

  const [cardCopy, setCardCopy] = useState(false);


  useEffect(() => {
    let copy = { ...card, };
    setCardCopy(copy);

    if (card.description.length > 0) {
      setShowDesc(true);
      setDesc(card.description);
    }

  }, [])



  function descChange(e) {
    let value = e.target.value;
    setDesc(value);
  }

  function todoChange(e) {
    let value = e.target.value;
    setTodo(value);
  }

  function handleTodo(e) {
    e.preventDefault();
    let data = {
      list: listId,
      card: card._id,
      todo: todo,
    }
    axios.post(`/checklists`, data)
      .then(response => {
        console.log(response);
      })
    setTodo("");
  }

  function handleDesc(e) {
    e.preventDefault();

    let data = {
      description: desc,
    }

    axios.patch(`/cards/${card._id}`, data)
      .then(response => {
        console.log(response);
        if (response.status === 201) {
          let data = response.data.description;
          setDesc(data);
          let newCard = { ...cardCopy, description: data };
          setCardCopy(newCard);
        }

      })

    setDesc("");
    setShowDesc(true);
  }

  function backdrop(e) {
    e.stopPropagation();
    close(false);
    console.log("click click")
  }

  if (open) {
    return ReactDOM.createPortal(
      <>
        <ModalWrapper>
          <section className="main-view">
            <div className="cont name">
              <h4>{card.name}</h4>
              <p>Created {moment(cardCopy.created).format('MMMM Do YYYY, h:mm:ss')}</p>
              <button onClick={backdrop} className="btn-exit">X</button>
            </div>
            <div className="cont description">
              <h4>Description</h4>
              {!showDesc ? <form onSubmit={handleDesc}>
                <textarea value={desc} onChange={descChange} className="text-input" placeholder="Set a card-description" type="text" name="desc" id="desc" rows="5" cols="40" />
                <input type="submit" value="Submit" />
              </form> : <div>
                  <div>
                    <p>{cardCopy.description}</p>

                  </div>
                  <button onClick={() => setShowDesc(false)}>Edit</button>
                </div>}
            </div>
            <div className="cont checklist">
              <form onSubmit={handleTodo}>
                <input value={todo} onChange={todoChange} className="text-input" type="text" name="check" id="check" />
                {todos.map(todo => {
                  return <label htmlFor=""><input onChange={todoChange} checked={todo.done ? "true" : "false"} type="checkbox" name="" id="" /></label>
                })}
              </form>

            </div>
          </section>
        </ModalWrapper>
        <Backdrop onClick={backdrop} />
      </>
      , document.body)
  }
  return null;

}