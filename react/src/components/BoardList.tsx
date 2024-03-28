import { useEffect, useState } from "react";
import BoardCard from "./BoardCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type iBoard = {
  id: number;
  title: string;
};

const BoardList = () => {
  const navigate = useNavigate();

  const [editCardId, setEditCardId] = useState(-1);
  const [boards, setBoards] = useState([] as iBoard[]);

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    axios
      .get("http://localhost:8000/api/board")
      .then((response) => {
        const data = response.data;
        setBoards(
          data.map((board: iBoard) => {
            return {
              id: board.id,
              title: board.title,
            };
          })
        );
      })
      .catch((err) => {
        console.error(err);
      });

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setEditCardId(-1);
    }
  };

  const onCardClick = (cardId: number) => {
    setEditCardId(cardId);
  };

  const onCardOpen = () => {
    navigate(`/board/${editCardId}`);
  };

  const editCardTitle = (boardId: number, title: string) => {
    axios
      .put(`http://localhost:8000/api/board/${boardId}`, {
        title: title,
      })
      .then((response) => {
        if (response.status === 200) {
          setBoards(
            boards.map((board) => {
              if (board.id === boardId) {
                return {
                  id: board.id,
                  title: title,
                };
              }

              return board;
            })
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addNewBoard = () => {
    axios
      .post("http://localhost:8000/api/board", { title: "New Board" })
      .then((response) => {
        if (response.status === 201) {
          const newBoard = response.data[0];
          setBoards([
            ...boards,
            {
              id: newBoard.id,
              title: newBoard.title,
            },
          ]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteBoard = () => {
    axios
      .delete(`http://localhost:8000/api/board/${editCardId}`)
      .then((response) => {
        if (response.status === 200) {
          setBoards(boards.filter((board) => board.id !== editCardId));
        }
      })
      .catch((err) => {
        console.error(err);
      });

    setEditCardId(-1);
  };

  const renderBoards = () => {
    const renderBoards = [];

    for (const boardKey in boards) {
      const board = boards[boardKey];
      renderBoards.push(
        <BoardCard
          key={board.id}
          title={board.title}
          boardId={board.id}
          editMode={editCardId === board.id}
          onCardClick={onCardClick}
          editCardTitle={editCardTitle}
          onCardOpen={onCardOpen}
          onCardDelete={deleteBoard}
        />
      );
    }

    return renderBoards;
  };

  return (
    <div className="flex-col content-center justify-center">
      <div>
        <h1>Boards</h1>
        <div
          className="add-list-btn max-w-40"
          onClick={() => {
            addNewBoard();
          }}
        >
          <span className="plus-sign px-1">+</span>
          <span>Add Board</span>
        </div>
      </div>
      <div>
        <div className="flex-col">{renderBoards()}</div>
      </div>
    </div>
  );
};

export default BoardList;
