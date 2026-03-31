import { calculateScore } from './helpers';

// Helper function to convert side number to initials
const getSideInitials = sideNumber => {
  const sideMapping = {
    1: 'TR', // Top-Right
    2: 'BR', // Bottom-Right
    3: 'B', // Bottom
    4: 'BL', // Bottom-Left
    5: 'TL', // Top-Left
    6: 'T', // Top
  };
  return sideMapping[sideNumber] || sideNumber;
};

export const downloadToCSV = (trialsLog, filename) => {
  if (!trialsLog || trialsLog.length === 0) {
    console.warn('No trials available to download.');
    return;
  }

  const csvRows = [];

  // Create headers: ID, Side1, Side2, Side3, Side4, Side5, Side6, Actions, Quarter-turns, Half-turns, Moves, Errors, Score
  const headers = [
    'ID',
    'Side1',
    'Side2',
    'Side3',
    'Side4',
    'Side5',
    'Side6',
    'Actions',
    'Quarter-turns',
    'Half-turns',
    'Moves',
    'Errors',
    'Score',
  ];
  csvRows.push(headers.join(','));

  // Process each trial
  trialsLog.forEach((trial, index) => {
    // Extract the 6 sides in order from the trial events and convert to initials
    const sides = trial.events
      .filter(event => event.sideNumber) // Only events that hit a side
      .map(event => getSideInitials(event.sideNumber));

    // Pad with empty strings if less than 6 sides (shouldn't happen but just in case)
    while (sides.length < 6) {
      sides.push('');
    }

    // Extract statistics from trial data (already calculated and stored)
    let totalActions = 0;
    let halfTurns = 0;
    let quarterTurns = 0;
    let totalMoves = 0;

    trial.events.forEach(event => {
      if (event.actions) {
        totalActions += event.actions.length;

        event.actions.forEach(action => {
          if (action.actionType === 'turn') {
            if (action.turnType === 'half') {
              halfTurns++;
            } else if (action.turnType === 'quarter') {
              quarterTurns++;
            }
          } else if (action.actionType === 'move') {
            totalMoves++;
          }
        });
      } else {
        // Fallback for events without actions
        totalActions += 1;
        quarterTurns += 2;
      }
    });

    const totalErrors = trial.events.filter(e => e.error).length;

    // Calculate score using new scoring rules (2 points for first hit, 1 point for subsequent)
    const score = calculateScore(trial.events);

    // Create row data
    const rowData = [
      index, // ID starting from 0
      ...sides.slice(0, 6), // First 6 sides
      totalActions,
      quarterTurns,
      halfTurns,
      totalMoves,
      totalErrors,
      score,
    ];

    // Escape and format values
    const values = rowData.map(value => {
      const escaped = ('' + value).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });

    csvRows.push(values.join(','));
  });

  const csvContent = csvRows.join('\n');

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
  link.download = filename || 'trials-data.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
