import { readFileSync } from 'fs';

function validateRange({ min, max, validatee }: { validatee: number; min: number; max: number }) {
  return validatee >= min && validatee <= max;
}

function validateSize({ size, validatee }: { validatee: string; size: number }) {
  return validatee?.length === size;
}

function validateSizeAndRange({
  min,
  max,
  validatee,
  size,
}: {
  validatee: string;
  min: number;
  max: number;
  size: number;
}) {
  return validateSize({ validatee, size }) && validateRange({ validatee: +validatee, min, max });
}

const validator = [
  {
    field: 'byr',
    rule: (validatee: string) => {
      return validateSizeAndRange({ validatee, min: 1920, max: 2020, size: 4 });
    },
  },
  {
    field: 'iyr',
    rule: (validatee: string) => {
      return validateSizeAndRange({ validatee, min: 2010, max: 2020, size: 4 });
    },
  },
  {
    field: 'eyr',
    rule: (validatee: string) => {
      return validateSizeAndRange({ validatee, min: 2010, max: 2030, size: 4 });
    },
  },
  {
    field: 'hgt',
    rule: (validatee: string) => {
      const matches = validatee.match(/^(\d+)(in|cm)$/);
      if (matches && matches.length === 3) {
        if (matches[2] === 'in') {
          return validateRange({ validatee: +matches[1], min: 59, max: 76 });
        } else {
          return validateRange({ validatee: +matches[1], min: 150, max: 193 });
        }
      }
      return false;
    },
  },
  {
    field: 'hcl',
    rule: (validatee: string) => {
      return !!validatee.match(/^#[0-9a-f]{6}$/i);
    },
  },
  {
    field: 'ecl',
    rule: (validatee: string) => {
      return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(validatee);
    },
  },
  {
    field: 'pid',
    rule: (validatee: string) => {
      return !!validatee.match(/^[0-9]{9}$/);
    },
  },
];

Object.freeze(validator);

function validatePassport(passport: { [key: string]: string }) {
  const v1 = validator.every(validation => !!passport[validation.field]);
  const v2 =
    v1 &&
    validator.every(validation => {
      const valRes = validation.rule(passport[validation.field]);
      return valRes;
    });

  return {
    v1,
    v2,
  };
}

const rawInput = readFileSync(__dirname + '/input').toString();

const input = rawInput.split('\n');

let index = 0;
const passports = [];
const stars = { star1: { valid: 0, invalid: 0 }, star2: { valid: 0, invalid: 0 } };
while (index < input.length) {
  const passport = [];

  while (!!input[index]) {
    passport.push(...input[index].trim().split(' '));
    index++;
  }

  const passportObj = passport.reduce((acc, next) => {
    const [key, value] = next.split(':');
    acc[key] = value.trim();
    return acc;
  }, {} as { [key: string]: string });

  const validation = validatePassport(passportObj);

  validation.v1 ? stars.star1.valid++ : stars.star1.invalid++;
  validation.v2 ? stars.star2.valid++ : stars.star2.invalid++;

  passports.push(passportObj);

  index++;
}

console.log(stars);
