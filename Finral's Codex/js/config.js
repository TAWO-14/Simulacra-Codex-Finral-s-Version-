const ATTRS = [
  { id: 'str', name: 'Força' },
  { id: 'dex', name: 'Destreza' },
  { id: 'con', name: 'Constituição' },
  { id: 'int', name: 'Inteligência' },
  { id: 'wis', name: 'Sabedoria' },
  { id: 'cha', name: 'Carisma' }
];

const SKILLS_DEF = [
  { id: 'acrobatics', name: 'Acrobacia', attr: 'dex' },
  { id: 'arcana', name: 'Arcanismo', attr: 'int' },
  { id: 'athletics', name: 'Atletismo', attr: 'str' },
  { id: 'deception', name: 'Enganação', attr: 'cha' },
  { id: 'stealth', name: 'Furtividade', attr: 'dex' },
  { id: 'history', name: 'História', attr: 'int' },
  { id: 'insight', name: 'Intuição', attr: 'wis' },
  { id: 'intimidation', name: 'Intimidação', attr: 'cha' },
  { id: 'investigation', name: 'Investigação', attr: 'int' },
  { id: 'animal', name: 'Lidar c/ Animais', attr: 'wis' },
  { id: 'medicine', name: 'Medicina', attr: 'wis' },
  { id: 'nature', name: 'Natureza', attr: 'int' },
  { id: 'perception', name: 'Percepção', attr: 'wis' },
  { id: 'performance', name: 'Performance', attr: 'cha' },
  { id: 'persuasion', name: 'Persuasão', attr: 'cha' },
  { id: 'sleight', name: 'Prestidigitação', attr: 'dex' },
  { id: 'religion', name: 'Religião', attr: 'int' },
  { id: 'survival', name: 'Sobrevivência', attr: 'wis' }
];

const ATTR_NAMES = {
  str: 'For',
  dex: 'Des',
  con: 'Con',
  int: 'Int',
  wis: 'Sab',
  cha: 'Car'
};

const TABELA_SLOTS_5E = {
  1: { 1: 2 },
  2: { 1: 3 },
  3: { 1: 4, 2: 2 },
  4: { 1: 4, 2: 3 },
  5: { 1: 4, 2: 3, 3: 2 },
  6: { 1: 4, 2: 3, 3: 3 },
  7: { 1: 4, 2: 3, 3: 3, 4: 1 },
  8: { 1: 4, 2: 3, 3: 3, 4: 2 },
  9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
  18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
  19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
  20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 }
};