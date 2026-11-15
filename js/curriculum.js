// The 16 regions of Numeria, one per unit of the Cambridge Lower Secondary Mathematics Stage 7 workbook.
export const UNITS = [
  { n: 1, title: 'Integers', region: 'Integer Highlands', terrain: 'peaks', color: '#7a9e7e', sections: [['1.1', 'Adding and subtracting integers'], ['1.2', 'Multiplying and dividing integers'], ['1.3', 'Lowest common multiples'], ['1.4', 'Highest common factors'], ['1.5', 'Tests for divisibility'], ['1.6', 'Square roots and cube roots']] },
  { n: 2, title: 'Expressions, formulae and equations', region: 'Algebra Woods', terrain: 'forest', color: '#3f7d4e', sections: [['2.1', 'Constructing expressions'], ['2.2', 'Using expressions and formulae'], ['2.3', 'Collecting like terms'], ['2.4', 'Expanding brackets'], ['2.5', 'Constructing and solving equations'], ['2.6', 'Inequalities']] },
  { n: 3, title: 'Place value and rounding', region: 'Place-Value Plains', terrain: 'plains', color: '#b5c46a', sections: [['3.1', 'Multiplying and dividing by powers of 10'], ['3.2', 'Rounding']] },
  { n: 4, title: 'Decimals', region: 'Decimal Dunes', terrain: 'dunes', color: '#e0b46a', sections: [['4.1', 'Ordering decimals'], ['4.2', 'Adding and subtracting decimals'], ['4.3', 'Multiplying decimals'], ['4.4', 'Dividing decimals'], ['4.5', 'Making decimal calculations easier']] },
  { n: 5, title: 'Angles and constructions', region: 'Angle Crags', terrain: 'crags', color: '#9a8f86', sections: [['5.1', 'A sum of 360°'], ['5.2', 'Intersecting lines'], ['5.3', 'Drawing lines and quadrilaterals']] },
  { n: 6, title: 'Collecting data', region: 'Data Marsh', terrain: 'marsh', color: '#6f9c8f', sections: [['6.1', 'Conducting an investigation'], ['6.2', 'Taking a sample']] },
  { n: 7, title: 'Fractions', region: 'Fraction Falls', terrain: 'falls', color: '#4f9fc9', sections: [['7.1', 'Ordering fractions'], ['7.2', 'Adding mixed numbers'], ['7.3', 'Multiplying fractions'], ['7.4', 'Dividing fractions'], ['7.5', 'Making fraction calculations easier']] },
  { n: 8, title: 'Shapes and symmetry', region: 'Mirror Lake', terrain: 'lake', color: '#6fb6d6', sections: [['8.1', 'Identifying the symmetry of 2D shapes'], ['8.2', 'Circles and polygons'], ['8.3', 'Recognising congruent shapes'], ['8.4', '3D shapes']] },
  { n: 9, title: 'Sequences and functions', region: 'Sequence Caverns', terrain: 'caves', color: '#7d6a9e', sections: [['9.1', 'Generating sequences (1)'], ['9.2', 'Generating sequences (2)'], ['9.3', 'Using the nth term'], ['9.4', 'Representing simple functions']] },
  { n: 10, title: 'Percentages', region: 'Percent Port', terrain: 'port', color: '#c97b5a', sections: [['10.1', 'Fractions, decimals and percentages'], ['10.2', 'Percentages large and small']] },
  { n: 11, title: 'Graphs', region: 'Graph Ridge', terrain: 'ridge', color: '#8aa35c', sections: [['11.1', 'Functions'], ['11.2', 'Graphs of functions'], ['11.3', 'Lines parallel to the axes'], ['11.4', 'Interpreting graphs']] },
  { n: 12, title: 'Ratio and proportion', region: 'Ratio Rapids', terrain: 'rapids', color: '#3d8bb0', sections: [['12.1', 'Simplifying ratios'], ['12.2', 'Sharing in a ratio'], ['12.3', 'Using direct proportion']] },
  { n: 13, title: 'Probability', region: 'Chance Canyon', terrain: 'canyon', color: '#c4683f', sections: [['13.1', 'The probability scale'], ['13.2', 'Mutually exclusive outcomes'], ['13.3', 'Experimental probabilities']] },
  { n: 14, title: 'Position and transformation', region: 'Compass Keep', terrain: 'keep', color: '#8a7f6e', sections: [['14.1', 'Maps and plans'], ['14.2', 'The distance between two points'], ['14.3', 'Translating 2D shapes'], ['14.4', 'Reflecting shapes'], ['14.5', 'Rotating shapes'], ['14.6', 'Enlarging shapes']] },
  { n: 15, title: 'Shapes, area and volume', region: 'Volume Volcano', terrain: 'volcano', color: '#b2493c', sections: [['15.1', 'Converting between units for area'], ['15.2', 'Using hectares'], ['15.3', 'The area of a triangle'], ['15.4', 'Calculating the volume of cubes and cuboids'], ['15.5', 'Calculating the surface area of cubes and cuboids']] },
  { n: 16, title: 'Interpreting results', region: 'Statistic Citadel', terrain: 'citadel', color: '#6c6f94', sections: [['16.1', 'Two-way tables'], ['16.2', 'Dual and compound bar charts'], ['16.3', 'Pie charts and waffle diagrams'], ['16.4', 'Infographics'], ['16.5', 'Representing data'], ['16.6', 'Using statistics']] },
];

export const LEVELS = [
  { L: 1, name: 'Warm-up', short: 'Bronze', perQ: 5, color: '#c98a4b' },
  { L: 2, name: 'Practice', short: 'Silver', perQ: 10, color: '#a9b4c2' },
  { L: 3, name: 'Challenge', short: 'Gold', perQ: 15, color: '#f2c14e' },
];
export const QUESTIONS_PER_TRIAL = 8;

export function findSection(code) {
  for (const u of UNITS) for (const [c, t] of u.sections) if (c === code) return { unit: u, code: c, title: t };
  return null;
}
