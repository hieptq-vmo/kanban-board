"use client";

import type { NextPage } from "next";

import { useEffect, useState } from "react";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import styles from "@/app/style/Home.module.css";
import Todos from "./components/todos";
import { POSTReq, Todo } from "./type";
import { ColumnType } from "./api/columns/route";

const Home: NextPage = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);

  const fetchColumns = async () => {
    axios.get("/api/columns").then((response) => setColumns(response.data));
  };

  useEffect(() => {
    fetchColumns();
  }, []);

  const addTile = async (columnId: string, tile: Todo) => {
    axios
      .post("/api/columns", {
        action: POSTReq.AddTitle,
        columnId,
        tile,
      })
      .then(function () {
        fetchColumns();
      })
      .catch(function () {
        console.error("Failed to add tile");
      });
  };

  const addColumn = async () => {
    axios
      .post("/api/columns", {
        action: POSTReq.AddColumn,
      })
      .then(function () {
        fetchColumns();
      })
      .catch(function () {
        console.error("Failed to add column");
      });
  };

  const onDragEndHandler = (result: DropResult) => {
    const { destination, source } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    const { index: sourceIndex, droppableId: sourceDroppableId } = source;
    const { index: destinationIndex, droppableId: destinationDroppableId } =
      destination;

    const sourceList = columns.find(
      (item) => item.id === sourceDroppableId
    )?.data;
    const destinationList = columns.find(
      (item) => item.id === destinationDroppableId
    )?.data;

    if (!sourceList || !destinationList) {
      throw new Error("Source or destination list not found");
    }

    // Extract the item to move
    const [itemToMove] = sourceList.splice(sourceIndex, 1);

    // Insert the item into the destination list at the specified index
    destinationList.splice(destinationIndex, 0, itemToMove);

    //TODO: add back to post
    axios
      .post("/api/columns", {
        action: POSTReq.ChangeColumn,
        newBoard: columns,
      })
      .then(function () {
        fetchColumns();
      })
      .catch(function () {
        console.error("Failed to change column");
      });
  };

  const callBackAddNewItem = (tableId: string) => {
    addTile(tableId, { id: uuidv4(), isDone: false, name: "" });
  };
  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <div className={styles.container}>
        <div className="flex flex-col items-center  min-h-screen pt-10">
          <div className="self-start">
            <button
              className="bg-[green] border boder-solid border-white p-5 rounded-md text-white font-bold"
              onClick={() => {
                addColumn();
              }}
            >
              New Column
            </button>
          </div>
          <Todos
            fetchColumns={fetchColumns}
            columns={columns}
            setCompletedTodos={() => {}}
            callBackAddNewItem={callBackAddNewItem}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default Home;
