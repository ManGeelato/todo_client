/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../bootswatch.css";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import axios from "axios";

const AddTodo = () => {
  const [dataText, setDataText] = useState("");
  const [todos, setTodos] = useState([]);
  const [toUpdateForm, setToUpdateForm] = useState("");
  const [dataToUpdate, setDataToUpdate] = useState("")

  //adding new item to database
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/todo", {
        item: dataText,
      });
      setTodos((prev) => [...prev, response.data]);
      setDataText("");
    } catch (error) {
      console.log(error);
    }
  };

  //create fetchAll data function using useEffect
  useEffect(() => {
    const getAllTodos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/todos");
        setTodos(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllTodos();
  }, []);

  //Delete item from the database
  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/todo/${id}`
      );
      const newTodoList = todos.filter((item) => item._id !== id);
      setTodos(newTodoList);
    } catch (error) {
      console.log(error);
    }
  };

  
  // updating the item
  const updateTodo = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.put(`http://localhost:8080/api/todo/${toUpdateForm}`, {item: dataToUpdate});
      const updatedIndex = todos.findIndex(item => item._id === toUpdateForm);
      const updatedItem = todos[updatedIndex].item = dataToUpdate
      setDataToUpdate("");
      setToUpdateForm("");
    }catch(err){
      console.log(err);
    }
  }

  //update form
  const updateForm = () => (
    <form className="updateForm" onSubmit={(e) => {updateTodo(e)}}>
      <input type="text" placeholder="Type here..." onChange={e => {setDataToUpdate(e.target.value)}} value={dataToUpdate} />
      <button type="submit">
        Update
      </button>
    </form>
  );

  return (
    <div className="home">
      <h1>Today's Plan!</h1>
      <form className="form" onSubmit={(e) => addTodo(e)}>
        <input
          type="text"
          placeholder="Type here..."
          onChange={(e) => {
            setDataText(e.target.value);
          }}
          value={dataText}
        />
        <button type="submit">Submit</button>
      </form>
      <div className="list">
        {todos?.length === 0 ? (
          <p>No Items available</p>
        ) : (
          todos.map((item, index) => (
            <div className="item" key={index}>
              {toUpdateForm === item._id ? (
                updateForm()
              ) : (
                <>
                  <p className="content">{item.item}</p>
                  <button
                    className="update"
                    onClick={() => {
                      setToUpdateForm(item._id);
                    }}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    className="delete"
                    onClick={() => {
                      deleteTodo(item._id);
                    }}
                  >
                    <AiFillDelete />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddTodo;
