'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { increment, decrement } from '../store/counterSlice';

export default function Counter() {
  // Local state (Challenge 02): useState + onClick
  const [localCount, setLocalCount] = useState(0);

  // Redux state (Challenge 15): useSelector + useDispatch
  const reduxCount = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        margin: '1rem auto',
        maxWidth: '320px',
      }}
    >
      <div>
        <strong>Local state counter</strong>
        <p style={{ margin: '0.25rem 0' }}>Value: {localCount}</p>
        <button
          type="button"
          data-testid="local-decrement"
          onClick={() => setLocalCount((c) => c - 1)}
          style={{ marginRight: '0.5rem' }}
        >
          -
        </button>
        <button
          type="button"
          data-testid="local-increment"
          onClick={() => setLocalCount((c) => c + 1)}
        >
          +
        </button>
      </div>

      <div>
        <strong>Redux counter</strong>
        <p style={{ margin: '0.25rem 0' }}>Value: {reduxCount}</p>
        <button
          type="button"
          data-testid="redux-decrement"
          onClick={() => dispatch(decrement())}
          style={{ marginRight: '0.5rem' }}
        >
          -
        </button>
        <button
          type="button"
          data-testid="redux-increment"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
    </div>
  );
}
