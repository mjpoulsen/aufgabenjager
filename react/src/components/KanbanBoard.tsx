import { useEffect, useState } from "react";
import iKanbanCard from "../types/iKanbanCard";
import KanbanList from "./KanbanList";
import axios from "axios";
import iKanbanList from "../types/iKanbanList";

type TaskResource = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  display_sequence: string;
  list_id: string;
};

const KanbanBoard = () => {
  // todo move to a separate constant file
  const DONE_KEY = 2147483647;

  const emptyKanbanMap: Record<string, Record<string, iKanbanCard>> = {};
  const emptyKanbanListMap: Record<string, iKanbanList> = {};
  const emptyListNameMap: Record<string, string> = {};

  const [editCardId, setEditCardId] = useState("");
  const [kanbanMapState, setKanbanMapState] = useState(emptyKanbanMap);
  const [dropEnterListId, setDropEnterListId] = useState("");
  const [draggedCardId, setDraggedCardId] = useState("");
  const [listNameMapState, setListNameMapState] = useState(emptyListNameMap);
  const [draggedListId, setDraggedListId] = useState("");
  const [kanbanListMap, setKanbanListMap] = useState(emptyKanbanListMap);

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    axios
      .get("http://localhost:8000/api/board/1/data")
      .then((response) => {
        const data = response.data;

        const lists: Record<string, iKanbanList> = data.lists;

        // add a DONE list to set of list; storing this in the db doesn't add much value because every board has one and tasks do not have their list_id updated to the DONE list key
        lists[DONE_KEY.toString()] = {
          id: DONE_KEY.toString(),
          title: "DONE",
          display_sequence: DONE_KEY,
          board_id: 1, // todo make this the current board when more than one is supported
        };

        const tasks: Record<string, Record<string, TaskResource>> = data.tasks;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tasksMap: Record<string, Record<string, any>> = {};

        const names: Record<string, string> = {};

        for (const listId in lists) {
          names[listId] = lists[listId].title;
          tasksMap[listId] = {};
        }

        for (const listId in tasks) {
          tasksMap[listId] = tasks[listId];

          for (const taskId in tasksMap[listId]) {
            const task = tasksMap[listId][taskId];
            if (task.completed) {
              delete tasksMap[listId][taskId];
              tasksMap[DONE_KEY][taskId] = task;
            }
          }
        }

        setKanbanListMap(lists);
        setKanbanMapState(tasksMap);
        setListNameMapState(names);
      })
      .catch((err) => {
        console.error(err);
      });

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const onCardCompleteMap = (
    id: string,
    listId: keyof typeof kanbanMapState
  ) => {
    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    const card = list[id];

    if (!card) {
      console.log(id, "id not found");
      return;
    }

    const completed = !card.completed;

    axios
      .put(`http://localhost:8000/api/task/${card.id}`, {
        completed: completed,
      })
      .then((response) => {
        if (response.data) {
          card.completed = completed;

          // If completed, move card to `done` list.
          // if not completed, move card back to original list.
          if (card.completed) {
            delete list[id];
            kanbanMapState[DONE_KEY][id] = card;
            // update original list
            setKanbanMapState({ ...kanbanMapState, [listId]: list });
          } else {
            delete kanbanMapState[DONE_KEY][id];
            kanbanMapState[card.list_id][id] = card;
            // update done list
            setKanbanMapState({ ...kanbanMapState });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const findListIdFromCardId = (cardId: string) => {
    for (const listId of Object.keys(kanbanMapState)) {
      if (kanbanMapState[listId][cardId]) {
        return listId;
      }
    }
    return "";
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setEditCardId("");
    }
  };

  const onCardClick = (cardId: string) => {
    setEditCardId(cardId);
  };

  const onCardDelete = (id: string, listId: keyof typeof kanbanMapState) => {
    axios
      .delete(`http://localhost:8000/api/task/${id}`)
      .then((response) => {
        if (response.data) {
          delete kanbanMapState[listId][id];
          setKanbanMapState({ ...kanbanMapState });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onCardAdd = (kanbanMapStateKey: string) => {
    console.log("added card to list", kanbanMapStateKey);

    const listLength =
      Object.keys(kanbanMapState[kanbanMapStateKey]).length + 1;

    const newCard: iKanbanCard = {
      title: `New Card`,
      list_id: kanbanMapStateKey,
      completed: false,
      display_sequence: listLength,
      due_date: new Date().toJSON().slice(0, 10),
    };

    axios
      .post("http://localhost:8000/api/task", newCard)
      .then((response) => {
        const newCardId = response.data.id;
        newCard.id = newCardId;

        kanbanMapState[kanbanMapStateKey][newCardId] = newCard;

        setKanbanMapState({ ...kanbanMapState });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const editCardTitle = (cardId: string, title: string) => {
    const listId = findListIdFromCardId(cardId);

    if (listId === "") {
      console.log("list id not found");
      return;
    }

    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    const card = list[cardId];

    if (!card) {
      console.log(cardId, "card id not found");
      return;
    }

    axios
      .put(`http://localhost:8000/api/task/${cardId}`, { title: title })
      .then((response) => {
        if (response.data) {
          card.title = title;
          setKanbanMapState({ ...kanbanMapState, [listId]: list });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const editListTitle = (listId: string, title: string) => {
    axios
      .put(`http://localhost:8000/api/list/${listId}`, { title: title })
      .then((response) => {
        if (response.data) {
          listNameMapState[listId as keyof typeof listNameMapState] = title;
          setListNameMapState({ ...listNameMapState });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const editCardDescription = (cardId: string, description: string) => {
    const listId = findListIdFromCardId(cardId);

    if (listId === "") {
      console.log("list id not found");
      return;
    }

    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    const card = list[cardId];

    if (!card) {
      console.log(cardId, "card id not found");
      return;
    }

    axios
      .put(`http://localhost:8000/api/task/${cardId}`, {
        description: description,
      })
      .then((response) => {
        if (response.data) {
          card.description = description;
          setKanbanMapState({ ...kanbanMapState, [listId]: list });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const editDueDate = (cardId: string, dueDate: string) => {
    const listId = findListIdFromCardId(cardId);

    if (listId === "") {
      console.log("list id not found");
      return;
    }

    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    const card = list[cardId];

    if (!card) {
      console.log(cardId, "card id not found");
      return;
    }

    axios
      .put(`http://localhost:8000/api/task/${cardId}`, { due_date: dueDate })
      .then((response) => {
        if (response.data) {
          card.due_date = dueDate;
          setKanbanMapState({ ...kanbanMapState, [listId]: list });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onListDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    console.debug("dragged list id", draggedListId);
    console.debug("drop enter list id", dropEnterListId);

    if (!draggedListId || !dropEnterListId) {
      console.debug("dragged list id or drop enter list id not found");
      return;
    }

    const reqBody: Record<string, number> = {};

    reqBody[draggedListId] = kanbanListMap[dropEnterListId].display_sequence;
    reqBody[dropEnterListId] = kanbanListMap[draggedListId].display_sequence;

    axios
      .put(`http://localhost:8000/api/list/reorder`, reqBody)
      .then((response) => {
        if (response.data) {
          const tempList = kanbanMapState[draggedListId];
          const dropEnterList = kanbanMapState[dropEnterListId];

          kanbanMapState[draggedListId] = dropEnterList;
          kanbanMapState[dropEnterListId] = tempList;

          const tempName =
            listNameMapState[draggedListId as keyof typeof listNameMapState];
          const dropEnterName =
            listNameMapState[dropEnterListId as keyof typeof listNameMapState];

          listNameMapState[draggedListId as keyof typeof listNameMapState] =
            dropEnterName;
          listNameMapState[dropEnterListId as keyof typeof listNameMapState] =
            tempName;

          setListNameMapState({ ...listNameMapState });
          setKanbanMapState({ ...kanbanMapState });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const dropCardReorder = (
    e: React.DragEvent<HTMLDivElement>,
    cardId: string
  ) => {
    e.stopPropagation();
    const draggedCardListId = findListIdFromCardId(draggedCardId);
    const cardListId = findListIdFromCardId(cardId);

    if (!draggedCardListId) {
      console.log("dragged list id not found");
      return;
    } else if (!cardListId) {
      console.log("card list id not found");
      return;
    }

    const draggedCard = kanbanMapState[draggedCardListId][draggedCardId];
    const otherCard = kanbanMapState[cardListId][cardId];

    const otherCardDisplayOrder = otherCard.display_sequence;

    const reqBody: Record<string, number> = {};

    for (const card of Object.values(kanbanMapState[cardListId])) {
      if (draggedCard.display_sequence >= otherCardDisplayOrder) {
        card.display_sequence += 1;
      } else {
        card.display_sequence -= 1;
      }

      if (card.id) {
        reqBody[card.id] = card.display_sequence;
      }
    }

    draggedCard.display_sequence = otherCardDisplayOrder;

    if (draggedCard.id) {
      reqBody[draggedCard.id] = draggedCard.display_sequence;
    }

    axios
      .put(`http://localhost:8000/api/task/reorder`, reqBody)
      .then((response) => {
        if (response.data) {
          if (draggedCardListId !== cardListId) {
            axios
              .put(`http://localhost:8000/api/task/${draggedCardId}`, {
                list_id: cardListId,
              })
              .then((response) => {
                if (response.data) {
                  delete kanbanMapState[draggedCardListId][draggedCardId];
                  kanbanMapState[cardListId][draggedCardId] = draggedCard;
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }

          setDraggedCardId("");
          setKanbanMapState({ ...kanbanMapState });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onCardDrag = (e: React.DragEvent<HTMLDivElement>, cardId: string) => {
    e.stopPropagation();
    console.debug("drag", cardId);
    setDraggedCardId(cardId);
  };

  const dragEnterList = (
    e: React.DragEvent<HTMLDivElement>,
    listId: string
  ) => {
    e.preventDefault();
    console.debug("drag enter", listId);
    setDropEnterListId(listId);
  };

  const onListDrag = (e: React.DragEvent<HTMLDivElement>, listId: string) => {
    e.preventDefault();
    console.debug("list drag", listId);
    setDraggedListId(listId);
  };

  const retrieveListTitle = (index: number) => {
    return listNameMapState[index.toString() as keyof typeof listNameMapState];
  };

  const addNewList = () => {
    const length = Object.keys(kanbanMapState).length;

    const newList: iKanbanList = {
      title: `New List`,
      display_sequence: length,
      board_id: 1, // todo once more boards are added, this should be dynamic
      id: "",
    };

    axios
      .post("http://localhost:8000/api/list", newList)
      .then((response) => {
        newList.id = response.data[0].id;
        listNameMapState[newList.id] = newList.title;
        kanbanMapState[newList.id] = {};
        kanbanListMap[newList.id] = newList;

        setListNameMapState({ ...listNameMapState });
        setKanbanMapState({ ...kanbanMapState });
        setKanbanListMap({ ...kanbanListMap})
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onDeleteList = (listId: string) => {
    const list = kanbanMapState[listId];

    if (!list) {
      console.log(listId, "list key not found");
      return;
    }

    axios
      .delete(`http://localhost:8000/api/list/${listId}`)
      .then((response) => {
        if (response.data) {
          delete kanbanMapState[listId];
          delete listNameMapState[listId as keyof typeof listNameMapState];

          setKanbanMapState({ ...kanbanMapState });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const displayKanbanLists = () => {
    const listsToDisplay = [];

    for (const kanbanMapKey in kanbanMapState) {
      const kanbanMap = kanbanMapState[kanbanMapKey];

      listsToDisplay.push(
        <KanbanList
          key={kanbanListMap[kanbanMapKey].display_sequence}
          listId={kanbanMapKey}
          listTitle={retrieveListTitle(Number(kanbanMapKey))}
          cardsMap={kanbanMap}
          editCardId={editCardId}
          onCardClick={onCardClick}
          onCardDelete={onCardDelete}
          onCardComplete={onCardCompleteMap}
          onCardAdd={onCardAdd}
          onListDrop={onListDrop}
          dragEnterList={dragEnterList}
          onListDrag={onListDrag}
          onCardDrag={onCardDrag}
          dropCardReorder={dropCardReorder}
          editCardTitle={editCardTitle}
          editCardDescription={editCardDescription}
          editDueDate={editDueDate}
          editListTitle={editListTitle}
          onDeleteList={onDeleteList}
        />
      );
    }

    return listsToDisplay.sort((a, b) => {
      const aKey = Number(a.key) || 0;
      const bKey = Number(b.key) || 0;
      return aKey - bKey;
    });
  };

  return (
    <div className="p-2">
      <div>
        <h1>Kanban Board</h1>
        <div
          className="add-list-btn max-w-20"
          onClick={() => {
            addNewList();
          }}
        >
          <span className="plus-sign px-1">+</span>
          <span>Add List</span>
        </div>
      </div>
      <div className="kanban-board flex">{displayKanbanLists()}</div>
    </div>
  );
};

export default KanbanBoard;
