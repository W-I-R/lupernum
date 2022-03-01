import {Difficulty} from './resources/global';

export namespace Settings {
  export const difficulty: Difficulty[] = [
    {
      icon: 'I',
      name: 'Veles',
      min: 1,
      max: 12,
    },
    {
      icon: 'II',
      name: 'Legionarius',
      min: 6,
      max: 100,
    },
    {
      icon: 'II',
      name: 'Aquilifer',
      min: 21,
      max: 600,
    },
    {
      icon: 'IV',
      name: 'Centurio',
      min: 100,
      max: 1000,
    },
    {
      icon: 'V',
      name: 'Generale',
      min: 1000,
      max: 3999,
    },
  ];
};
