import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);
    
    if (previousValue !== null && operation && !newNumber) {
      calculate();
    } else {
      setPreviousValue(currentValue);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = () => {
    if (previousValue === null || operation === null) return;
    
    const currentValue = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = previousValue + currentValue;
        break;
      case '-':
        result = previousValue - currentValue;
        break;
      case '×':
        result = previousValue * currentValue;
        break;
      case '÷':
        result = currentValue !== 0 ? previousValue / currentValue : 0;
        break;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handlePercent = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  const handleNegate = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const buttonClass = "h-16 text-xl font-medium";
  const numberButtonClass = `${buttonClass} bg-muted hover:bg-muted/80`;
  const operationButtonClass = `${buttonClass} bg-primary hover:bg-primary/90 text-primary-foreground`;
  const topButtonClass = `${buttonClass} bg-muted/50 hover:bg-muted/70`;

  return (
    <div className="h-full flex flex-col bg-background p-4">
      <div className="flex-1 flex items-end justify-end p-6 text-5xl font-light mb-4 bg-muted/30 rounded-lg">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Button onClick={handleClear} className={topButtonClass}>AC</Button>
        <Button onClick={handleNegate} className={topButtonClass}>+/-</Button>
        <Button onClick={handlePercent} className={topButtonClass}>%</Button>
        <Button onClick={() => handleOperation('÷')} className={operationButtonClass}>÷</Button>

        <Button onClick={() => handleNumber('7')} className={numberButtonClass}>7</Button>
        <Button onClick={() => handleNumber('8')} className={numberButtonClass}>8</Button>
        <Button onClick={() => handleNumber('9')} className={numberButtonClass}>9</Button>
        <Button onClick={() => handleOperation('×')} className={operationButtonClass}>×</Button>

        <Button onClick={() => handleNumber('4')} className={numberButtonClass}>4</Button>
        <Button onClick={() => handleNumber('5')} className={numberButtonClass}>5</Button>
        <Button onClick={() => handleNumber('6')} className={numberButtonClass}>6</Button>
        <Button onClick={() => handleOperation('-')} className={operationButtonClass}>-</Button>

        <Button onClick={() => handleNumber('1')} className={numberButtonClass}>1</Button>
        <Button onClick={() => handleNumber('2')} className={numberButtonClass}>2</Button>
        <Button onClick={() => handleNumber('3')} className={numberButtonClass}>3</Button>
        <Button onClick={() => handleOperation('+')} className={operationButtonClass}>+</Button>

        <Button onClick={() => handleNumber('0')} className={`${numberButtonClass} col-span-2`}>0</Button>
        <Button onClick={handleDecimal} className={numberButtonClass}>.</Button>
        <Button onClick={calculate} className={operationButtonClass}>=</Button>
      </div>
    </div>
  );
};
