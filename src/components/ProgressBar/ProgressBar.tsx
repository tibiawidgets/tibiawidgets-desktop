import React from 'react';

export type ProgressBarType = {
  stage: number;
  labels: string[];
};

export const ProgressBar: React.FC<ProgressBarType> = ({
  stage,
  labels,
}: ProgressBarType) => {
  const numStages = labels.length;
  return (
    <div className="h-8 relative max-w-screen-lg rounded-full overflow-hidden mb-3">
      <div className="w-full h-full absolute" />
      {labels.map((label, index) => (
        <React.Fragment key={label}>
          <div
            className="flex flex-col items-center h-full bg-green-200 absolute"
            style={{
              width: `${
                stage >= index + 1 ? ((index + 1) / numStages) * 100 : 0
              }%`,
            }}
          />
          <div
            className="h-full absolute flex flex-col items-center"
            style={{
              left: `${(index / numStages) * 100}%`,
              marginLeft: '1rem',
            }}
          >
            <div className="h-4 w-4 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
              {index + 1}
            </div>
            {label && <div className="text-xs text-center">{label}</div>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;
