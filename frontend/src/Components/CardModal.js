import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import moment from "moment";
import axios from "axios";

import DelTodo from "./DelTodo";

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
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
  }
  .checklist {
    height: 250px;
  }

  .btn-exit {

  }

  .cont {
    width: 100%;
  }
  .name {
    margin: 15px 0px 8px 0px;
    display: flex;
    justify-content: space-between;
    height: 75px;
  }
  .name-cont:last-child {
    display: flex;

  }
  .name-cont {
    height: 75px;
  }
  .btn-exit {
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2px;
    :hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.3);
      color: #ffffff;
    }
  }
 .todo-cont {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    height: 170px;
    overflow: auto;
 }

 .checkbox {
    height: 20px;
    width: 20px;
    margin: 4px;
    :hover {
      cursor: pointer;
    }
 }
 .check-label {
    margin: 6px 0px 0px 0px;
    display: flex;
    align-items: center;
 }

 .flex-cont {
   display: flex;
   

 }

 .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    :hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
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

export default function CardModal({ change, listId, card, open, setTodos, close, todos, lists }) {
  const [desc, setDesc] = useState("");
  const [todo, setTodo] = useState("");
  const [name, setName] = useState(card.name);
  const [showDesc, setShowDesc] = useState(false);
  const [editName, setEditName] = useState(false);

  const [cardCopy, setCardCopy] = useState({});

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

  function onTodo(e) {
    let value = e.target.value;
    setTodo(value);
  }

  function handleTodo(e) {
    e.preventDefault();
    e.stopPropagation();
    if (todo.length < 1) return;
    let data = {
      card: card._id,
      todo: todo,
      done: false,
    }
    axios.post(`/checklists`, data)
      .then(response => {
        data._id = response.data._id;
        let listCopy = [...todos];
        listCopy.push(data);
        setTodos(listCopy);
      })
      .catch(e => {
        console.error(e);
      })

    setTodo("");
  }

  function onTodoChange(e) {
    e.stopPropagation();

    let todoId = e.target.name;
    let todosCopy = [...todos];
    let clickedTodo = todosCopy.find(x => x._id === todoId);

    let data = {
      done: !clickedTodo.done,
    }
    axios.patch(`/checklists/${todoId}`, data)
      .then(result => {
        if (result.status === 201) {
          clickedTodo.done = !clickedTodo.done;
          let newTodos = [...todosCopy];
          setTodos(newTodos);
        }
      })
      .catch(e => {
        console.error(e);
      })
  }

  function handleDesc(e) {
    e.preventDefault();

    let data = {
      description: desc,
    }

    axios.patch(`/cards/${card._id}`, data)
      .then(response => {
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
  }

  function moveCard(e) {
    let moveToList = e.target.value;
    //axios.post
    axios.patch(`/cards/move/${card._id}/lists/${moveToList}`)
      .then(result => {
        close(false);
        change(true);
      })
      .catch(e => {
        console.error(e);
      })
  }

  function nameChange() {
    setEditName(true);
  }

  function nameSubmit(e) {
    e.preventDefault();
    let data = {
      name: name,
    }
    axios.patch(`/cards/${card._id}`, data)
      .then(result => {
        if (result.status === 201) {
          change(true);
          setEditName(false);
        }
      })
      .catch(e => {
        console.error(e);
      })
  }

  function onNameChange(e) {
    let value = e.target.value;
    setName(value);
  }

  function deleteCard() {
    axios.delete(`/cards/${card._id}`)
      .then(result => {
        if (result.status === 204) {
          close(false);
          change(true);

        }
      })
      .catch(e => {
        console.error(e);
      })
  }

  if (open) {
    return ReactDOM.createPortal(
      <>
        <ModalWrapper>
          <section className="main-view">
            <div className="cont name">
              <div className="name-cont">
                <div className="flex-cont">
                  {!editName ? <h4>{card.name}</h4> : <form onSubmit={nameSubmit} action=""><input autoFocus={true} type="text" onChange={onNameChange} value={name} /> </form>}
                  {!editName ? <button onClick={nameChange}>Edit</button> : <button onClick={nameSubmit}>Edit</button>}
                  {editName ? null : <button onClick={deleteCard} className="del-btn">Delete card</button>}

                </div>
                <p>Created: {moment(cardCopy.created).format('MMMM Do YYYY, h:mm')}</p>
              </div>
              <div className="name-cont">
                <div>
                  <select onChange={moveCard} name="lists" id="lists">
                    <option key={"self"} value="move">Move card:</option>
                    {lists.map(x => {
                      if (x._id !== listId) return <option key={x._id} value={x._id}>{x.name}</option>
                    })}

                  </select>
                </div>
              </div>
              <button onClick={backdrop} className="btn-exit">X</button>
            </div>
            <div className="cont checklist">
              <h4>Checklist</h4>
              <form onSubmit={handleTodo}>
                <input value={todo} onChange={onTodo} placeholder="Add todo" className="text-input" type="text" name="check" id="check" />
              </form>
              <div className="todo-cont">
                {todos.map(todo => {
                  return (
                    <div key={todo._id} className="todo-item">
                      <label className="check-label" htmlFor={todo._id}><input className="checkbox" onChange={onTodoChange} checked={todo.done} type="checkbox" name={todo._id} />{todo.todo}</label>
                      <DelTodo todos={todos} setTodos={setTodos} id={todo._id} />
                    </div>
                  )
                })}

              </div>

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

          </section>
        </ModalWrapper>
        <Backdrop onClick={backdrop} />
      </>
      , document.body)
  }
  return null;
}