import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import axios from "axios";

const RenameModal = styled.section`
  z-index: 1;
  height: 200px;
  width: 200px;
  position: absolute;
  top: 20%;
  left: calc(50% - 100px);
  background-color: #E5EFF5;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
  border: 1px solid #ffffff;
  
  form {
    text-align: center;
  }

  button {
    margin: 8px;
  }

  p {
    font-size: 14px;
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
export default function RenameList({ name, open, id, listChange, setOpen }) {


  const [newName, setNewName] = useState(name);


  function onChange(e) {
    let value = e.target.value;
    setNewName(value);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (e.target.list.value.length < 1) return;
    let data = {
      name: newName,
    }
    axios.patch(`/lists/${id}`, data)
      .then(result => {
        if (result.status === 201) {
          listChange(true);
          setOpen(false);
        }
      })
  }

  function backdrop() {
    setOpen(false);
  }

  if (open) {
    return ReactDOM.createPortal(
      <>
        <RenameModal>
          <div>
            <p>Choose new name</p>
          </div>
          <form onSubmit={onSubmit}>
            <input autoFocus={true} onChange={onChange} value={newName} type="text" name="list" id="list" />
            <button type="submit">Change</button>
            <button onClick={() => setOpen(false)}>Cancel</button>
          </form>
        </RenameModal>
        <Backdrop onClick={backdrop} />
      </>, document.body
    )
  }
  return null;

}