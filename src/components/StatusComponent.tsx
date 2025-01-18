import React from "react";

interface StatusCard {
  value: number;
  label: string;
  backgroundColor: string;
  textColor: string;
}

interface StatusComponentProps {
  title: string;
  statusCards: StatusCard[];
}

const StatusComponent: React.FC<StatusComponentProps> = ({ title, statusCards }) => {
  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-6 text-center">{title}</h3>
      {/* Status Bars */}
      <div className="flex flex-col gap-4 items-center flex-grow justify-center">
        {statusCards.map((card, index) => (
          <div
            key={index}
            className="flex justify-between items-center rounded-lg p-4 shadow w-4/5"
            style={{
              backgroundColor: card.backgroundColor,
              color: card.textColor,
            }}
          >
            <span className="text-2xl font-bold">{card.value}</span>
            <span className="text-sm">{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusComponent;
