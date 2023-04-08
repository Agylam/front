import plusImg from "../assets/plus.svg";
import React, { useLayoutEffect, useState } from "react";
import removeImg from "../assets/remove.svg";
import "../css/DayComponent.css";
import dayFetch from "../fetches/dayFetch";
import setDayFetch from "../fetches/setDayFetch";
import ILesson from "../interfaces/ILesson";
import LessonComponent from "./LessonComponent";


interface IDayParams {
    dow: number;
}


const weekDays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
];
export default function DayComponent({ dow }: IDayParams) {
  const [lessons, setLessons] = useState<ILesson[] | null>([]);
  useLayoutEffect(() => {
    const dayFetcher = async () => {
      try {
        const lessons: ILesson[] = await dayFetch(dow);
        setLessons(lessons);
      } catch (resp) {
        console.log("err" + dow, resp);
      }
    };

    dayFetcher();
  }, [dow]);
  const pushToBack = async (less: ILesson[]) => {
    try {
      const resp: string = await setDayFetch(
        dow,
        less,
        localStorage.getItem("jwt") as string
      );

      console.log("sus" + dow, resp);
    } catch (resp) {
      console.log("err" + dow, resp);
    }
  };
  //useEffect(pushToBack, [lessons]);

  const changeTime = async (order: number, type: boolean, time: string) => {
    // i would make the changing in db as higher priority than changing in UI
    // but for saving the initial logic (UI update -> db update)
    // if the db update would throw an error than UI will have irrelevant data

    const awaitedState = await new Promise<ILesson[]>((resolve) => {
      setLessons((prevState: ILesson[] | null) => {
        let updatedState: ILesson[] = [];
        if (prevState != null) {
          updatedState = prevState.map((v, k) => {
            if (k == order) {
              if (type) {
                return { ...v, end: time };
              } else {
                return { ...v, start: time };
              }
            } else {
              return v;
            }
          });
        }

        resolve(updatedState);
        return updatedState;
      });
    });

    await pushToBack(awaitedState);
    console.log(lessons);
  };
  const addLesson = async () => {
    // if the db update would throw an error than UI will have irrelevant data
    const awaitedState = await new Promise<ILesson[]>((resolve) => {
      setLessons((prevState: ILesson[] | null) => {
        const updatedState = prevState == null ? [] : [...prevState];
        updatedState.push({
          start: "10:00",
          end: "11:00",
        });

        resolve(updatedState);
        return updatedState;
      });
    });

    await pushToBack(awaitedState);
    console.log(lessons);
  };
  const removeLesson = async (order: number) => {
    // if the db update would throw an error than UI will have irrelevant data

    const awaitedState = await new Promise<ILesson[]>((resolve) => {
      setLessons((prevState: ILesson[] | null) => {
        const updatedState =
          prevState == null
            ? []
            : prevState.filter((_, index) => index !== order);

        resolve(updatedState);
        return updatedState;
      });
    });

    await pushToBack(awaitedState);
    console.log(lessons);
  };
  return (
    <div className="day" id="first-day">
      <div className="day_top">
        <p className="static">Расписание</p>
        <p className="name">{weekDays[dow]}</p>
      </div>
      <div className="lessons_wrapper">
        {lessons?.map((obj: ILesson, key) => {
          return (
            <div className="lesson" key={key}>
              <div className="left">
                <p className="number">{key + 1}-й</p>
              </div>
              <div className="right">
                <div className="time">
                  <input
                    type="time"
                    className="les_time"
                    value={lessons[key].start}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      changeTime(key, false, event.target.value)
                    }
                  />
                  <p className="wall">:</p>
                  <input
                    type="time"
                    className="les_time"
                    value={lessons[key].end}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      changeTime(key, true, event.target.value)
                    }
                  />
                </div>
                <div className="remove">
                  <button
                    onClick={() => {
                      removeLesson(key);
                    }}
                  >
                    <img className="remove" src={removeImg} alt="img" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="add">
        <button onClick={addLesson}>
          <img src={plusImg} className="add" alt="img" />
        </button>
      </div>
    </div>
  );
}