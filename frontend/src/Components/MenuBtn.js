import React, { useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { capLetter } from "../Utils";

const Btn = styled.div`
  height: 30px;
  width: 30px;
  position: relative;
  top: 0px;
  left: 0px;
  border-radius: 2px;
  text-align: center;
  line-height: 15px;
:hover{
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);

}
:active {
  background-color: rgba(0, 0, 0, 0.4);
}
  .mask {
    height: 100vh;
    width: 100vw;
    z-index: 0;
    background-color: #ffffff;
    opacity: 0.6;
    
    
  }

  .menu {
    height fit-content;
    width: 170px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background-color: #ffffff;
    position: absolute;
    top: 34px;
    left: 0px;
  }

  .menu-cont {
    margin: 4px;
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-radius: 4px;
  }

  .menu-click {
    :hover {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;

    }
  }
  
  .menu-cont:first-child {
    justify-content: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    :hover {
      cursor: default;
    }
  }

  .menu-item {
    padding: 0px 0px 0px 4px;
    font-size: 13px;
  }

  

`

export default function MenuBtn({ openRename, type, id, isClicked, updateClick, icon, lists, setLists }) {
  useEffect(() => {

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      updateClick(false);
    }
  }
  const ref = useRef();

  function delPost(type, id) {
    axios.delete(`/${type}s/${id}`)
      .then(response => {
        console.log(response);
        let newLists = lists.filter(x => x._id !== id)
        setLists(newLists);
      })
      .catch(e => {
        console.error(e);
      })
  }

  function reName(e) {
    e.stopPropagation();
    openRename(true);
    updateClick(false);
  }

  function onClick(e) {
    e.stopPropagation();
    delPost(type, id);
    updateClick(false)
  }

  let menu;
  isClicked ? menu = <section ref={ref} className="menu-section">
    <div className="menu">
      <div className="menu-cont">
        <p className="menu-item">{`${capLetter(type)}menu`}</p>
      </div>
      <div className="menu-cont menu-click" onClick={onClick}>
        <p className="menu-item">Delete this {type}</p>
      </div>
      <div className="menu-cont menu-click" onClick={reName}>
        <p className="menu-item">Rename list</p>
      </div>
    </div >

  </section> : menu = null;
  return (
    <Btn onClick={() => updateClick(true)}>
      {icon}
      {menu}
    </Btn >

  )
}