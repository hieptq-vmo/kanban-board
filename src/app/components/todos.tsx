import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import TodoItem from "./todoitem";
import { ColumnType } from "../api/columns/route";
import { Todo } from "../type";

interface Props {
  columns: ColumnType[];
  callBackAddNewItem: (columnId: string) => void;
  setCompletedTodos: () => void;
  fetchColumns: () => void;
}

const Todos: React.FC<Props> = ({
  callBackAddNewItem,
  columns,
  fetchColumns,
}) => {
  return (
    <div className="flex h-fit w-full gap-6 mt-4 overflow-auto pb-5">
      {columns?.map((column: ColumnType) => (
        <Droppable droppableId={column.id} key={column.id}>
          {(droppableProvided, droppableSnapshot) => (
            <div
              className="bg-gray-400 px-5 py-3 rounded-md min-w-80"
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              <div className="flex justify-between">
                <span className="text-white text-2xl font-semibold">
                  {column.title}
                </span>
                <span
                  onClick={() => callBackAddNewItem(`${column.id}`)}
                  className="text-2xl text-white cursor-pointer"
                >
                  +
                </span>
              </div>
              {column.data?.map((todo: Todo, index: number) => {
                return (
                  <TodoItem
                    fetchColumns={fetchColumns}
                    columnId={column.id}
                    index={index}
                    key={todo?.id}
                    todo={todo}
                  />
                );
              })}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
};

export default Todos;
