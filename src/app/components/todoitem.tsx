import { Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { POSTReq, Todo } from "../type";

interface Props {
  index: number;
  todo: Todo;
  columnId: string;
  fetchColumns: () => void;
}

const TodoItem: React.FC<Props> = ({ index, todo, fetchColumns, columnId }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<Todo>({
    id: todo.id,
    name: todo.name,
    isDone: todo.isDone,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const handleEdit = () => {
    if (!edit) {
      setEdit(true);
    }
  };

  const handleEditNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    titleId: string
  ) => {
    setEditTitle({ id: titleId, name: e.target.value, isDone: false });
  };

  const handleEditNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post("/api/columns", {
        action: POSTReq.UpdateTitle,
        columnId,
        tile: editTitle,
      })
      .then(function () {
        setEdit(false);
        fetchColumns();
      })
      .catch(function () {
        console.error("Failed to edit item");
      });
  };

  return (
    <Draggable draggableId={todo.id.toString()} index={index} key={todo.id}>
      {(draggableProvided, draggableSnapshot) => (
        <form
          onClick={handleEdit}
          className="flex rounded-md bg-yellow-300  w-full p-[20px] mt-[15px] transition hover:scale-105 hover:shadow-md"
          onSubmit={handleEditNameSubmit}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
          ref={draggableProvided.innerRef}
        >
          {todo.isDone && !edit ? (
            <span className="flex-1">{todo.name}</span>
          ) : edit || !todo.isDone ? (
            <input
              autoFocus
              className="text-black px-1 py-2 flex-1 outline-none rounded-md"
              type="text"
              ref={inputRef}
              value={editTitle.name}
              onChange={(e) => handleEditNameChange(e, todo.id)}
            />
          ) : (
            <span className="flex-1">{todo.name}</span>
          )}
        </form>
      )}
    </Draggable>
  );
};

export default TodoItem;
