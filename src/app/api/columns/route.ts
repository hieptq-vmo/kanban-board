import { POSTReq, Todo } from "@/app/type";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export interface ColumnType {
  id: string;
  title: string;
  data: Todo[];
}
export const genRandom = () => {
  return {
    id: uuidv4(),
    name: `${uuidv4().slice(0, 8)}`,
    isDone: true,
  };
};

let columns: ColumnType[] = [
  { id: `${1}`, title: "1", data: [genRandom(), genRandom()] },
  { id: `${2}`, title: "2", data: [genRandom()] },
  { id: `${3}`, title: "3", data: [genRandom()] },
];

export async function GET() {
  return NextResponse.json(columns);
}

export async function POST(request: Request) {
  const res: { action: POSTReq; columnId: string; tile: Todo, newBoard: ColumnType[],  } =
    await request.json();

    if (res.action === POSTReq.AddColumn) {
    const newColumn: ColumnType = {
      id: `${columns.length + 1}`,
      title: `${columns.length + 1}`,
      data: [],
    };
    columns.push(newColumn);
    return NextResponse.json(newColumn, { status: 201 });
  }



  if (res.action === POSTReq.AddTitle) {
    const { columnId, tile } = await res;
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      const newTile = { ...tile};
      column.data.push(newTile);
      return NextResponse.json(newTile, { status: 201 });
    } else {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }
  }


  if (res.action === POSTReq.ChangeColumn) {
    const { newBoard } = await res;
    columns = newBoard;
    return NextResponse.json(newBoard, { status: 201 });
  }



  if (res.action === POSTReq.UpdateTitle) {
    const { tile, columnId } = await res;
    updateNameById(columnId, tile.id, tile.name)
    return NextResponse.json('newBoard', { status: 201 });
  }
}

function updateNameById(parentId: string, itemId: string, newName: string) {
  const parent = columns.find(item => item.id === parentId);
  if (parent) {
      const item = parent.data.find(d => d.id === itemId);
      if (item) {
          item.name = newName;
          item.isDone = true;
      }
  }
}