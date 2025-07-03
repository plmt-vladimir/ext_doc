import { useState } from "react";
import Card from "../../components/widgets/Card";
import PageWrapper from "../../components/layout/PageWrapper";

export default function HomePage() {
  const [level, setLevel] = useState(1);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const constructionObjects = [
    { id: 1, name: "Объект строительства №1" },
    { id: 2, name: "Объект строительства №2" },
    { id: 1, name: "Объект строительства №1" },
    { id: 2, name: "Объект строительства №2" },
    { id: 1, name: "Объект строительства №1" },
    { id: 2, name: "Объект строительства №2" },
    { id: 1, name: "Объект строительства №1" },
    { id: 2, name: "Объект строительства №2" },
    { id: 1, name: "Объект строительства №1" },
    { id: 2, name: "Объект строительства №2" },
    { id: 1, name: "Объект строительства №1" },
    { id: 2, name: "Объект строительства №2" },
    { id: 1, name: "Объект строительства №1" },
    { id: 2, name: "Объект строительства №2" },
    { id: 1, name: "Объект строительства №1" },
    { id: 2, name: "Объект строительства №2" },
    { id: 1, name: "Объект строительства №1" },
    { id: 2, name: "Объект строительства №2" },
  ];

  const buildingObjects = {
    1: [
      { id: 11, name: "Корпус A" },
      { id: 12, name: "Корпус B" },
    ],
    2: [
      { id: 21, name: "Цех 1" },
      { id: 22, name: "Цех 2" },
    ],
  };

  const sections = {
    11: [{ id: 111, name: "Участок 1А" }, { id: 112, name: "Участок 1Б" }],
    12: [{ id: 121, name: "Участок 2А" }],
    21: [{ id: 211, name: "Участок 3А" }],
    22: [{ id: 221, name: "Участок 4А" }],
  };

  const goBack = () => {
    if (level === 3) {
      setLevel(2);
      setSelectedBuilding(null);
    } else if (level === 2) {
      setLevel(1);
      setSelectedObject(null);
    }
  };

  const title =
    level === 1
      ? "Объекты строительства"
      : level === 2
      ? `Строительные объекты: ${selectedObject?.name}`
      : `Участки: ${selectedBuilding?.name}`;

  return (
    <PageWrapper title={title} onBack={level > 1 ? goBack : null}>
      <div className="flex flex-wrap gap-6">
        {level === 1 &&
          constructionObjects.map((obj, i) => (
            <Card
              key={`${obj.id}-${i}`}
              title={obj.name}
              onClick={() => {
                setSelectedObject(obj);
                setLevel(2);
              }}
            />
          ))}

        {level === 2 &&
          buildingObjects[selectedObject?.id]?.map((b) => (
            <Card
              key={b.id}
              title={b.name}
              onClick={() => {
                setSelectedBuilding(b);
                setLevel(3);
              }}
            />
          ))}

        {level === 3 &&
          sections[selectedBuilding?.id]?.map((s) => (
            <Card
              key={s.id}
              title={s.name}
              onClick={() => alert("Открыть " + s.name)}
            />
          ))}
      </div>
    </PageWrapper>
  );
}