'use client';

import styles from './BeitcoinKeypad.module.css';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onDelete: () => void;
}

export default function BeitcoinKeypad({ onKeyPress, onClear, onDelete }: KeypadProps) {
  const keys = [
    { label: '1', type: 'digit' },
    { label: '2', type: 'digit' },
    { label: '3', type: 'digit' },
    { label: '4', type: 'digit' },
    { label: '5', type: 'digit' },
    { label: '6', type: 'digit' },
    { label: '7', type: 'digit' },
    { label: '8', type: 'digit' },
    { label: '9', type: 'digit' },
    { label: 'C', type: 'clear' },
    { label: '0', type: 'digit' },
    { label: '⌫', type: 'delete' },
  ];

  return (
    <div className={styles.grid}>
      {keys.map((key) => (
        <button
          key={key.label}
          type="button"
          onClick={() => {
            if (key.type === 'clear') onClear();
            else if (key.type === 'delete') onDelete();
            else onKeyPress(key.label);
          }}
          className={`
            ${styles.button} 
            ${key.type === 'clear' ? styles.clear : ''} 
            ${key.type === 'delete' ? styles.delete : ''}
          `}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}