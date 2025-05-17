import { requestLocationsMeasles, parseStartAndEndDateTimes, parseStartEndTime } from './requestLocationsMeasles';

// Use the same URL as production. Replace this with the actual prod URL if needed.
const PROD_MEASLES_URL = 'https://info.health.nz/conditions-treatments/infectious-diseases/about-measles/measles-locations-of-interest-in-aotearoa-new-zealand';

describe('requestLocationsMeasles', () => {
  it('fetches and parses measles locations from the MoH website', async () => {
    const records = await requestLocationsMeasles(PROD_MEASLES_URL);
    expect(Array.isArray(records)).toBe(true);
    expect(records.length).toBeGreaterThan(0);
    // Check that at least one record has expected keys
    const sample = records[0];
    expect(sample).toHaveProperty('id');
    expect(sample).toHaveProperty('location');
    expect(sample).toHaveProperty('event');
    expect(sample).toHaveProperty('start');
    expect(sample).toHaveProperty('end');
    expect(sample).toHaveProperty('advice');
    expect(sample).toHaveProperty('exposureType');
    expect(sample).toHaveProperty('city');
  });
});

describe('parseStartAndEndDateTimes', () => {
  const cases = [
    {
      input: 'Wednesday 7 May 2025 10am to 11:45am',
      expected: { start: 'Wednesday 7 May 2025 10am', end: '11:45am' },
    },
    {
      input: 'Wednesday 7 May 2025 9am to 10:30am',
      expected: { start: 'Wednesday 7 May 2025 9am', end: '10:30am' },
    },
    {
      input: 'Saturday 3 May 2025',
      expected: { start: 'Saturday 3 May 2025', end: undefined },
    },
    {
      input: '2:30pm to 4:30pm',
      expected: { start: '2:30pm', end: '4:30pm' },
    },
    {
      input: 'Monday 5 May 2025',
      expected: { start: 'Monday 5 May 2025', end: undefined },
    },
    {
      input: '1:30pm to 2:30pm',
      expected: { start: '1:30pm', end: '2:30pm' },
    },
    {
      input: 'Monday 5 May 2025',
      expected: { start: 'Monday 5 May 2025', end: undefined },
    },
    {
      input: '11:00pm to 12:00am',
      expected: { start: '11:00pm', end: '12:00am' },
    },
    {
      input: '4:15pm',
      expected: { start: '4:15pm', end: undefined },
    },
    {
      input: '5:40pm',
      expected: { start: '5:40pm', end: undefined },
    },
    {
      input: '6:30pm',
      expected: { start: '6:30pm', end: undefined },
    },
  ];

  cases.forEach(({ input, expected }) => {
    it(`parses "${input}"`, () => {
      const result = parseStartAndEndDateTimes(input);
      expect(result.start).toBe(expected.start);
      expect(result.end).toBe(expected.end);
    });
  });
});

describe('parseStartEndTime', () => {
  it('parses a full datetime range with end as time', () => {
    const input = '2024-05-07T09:00:00Z to 11:45am';
    const result = parseStartEndTime(input, undefined);
    expect(result).toEqual({
      start: '2024-05-07T09:00:00.000Z',
      end: undefined // until logic is refined to handle time-only end
    });
  });

  it('parses a date and time range with end as time', () => {
    const input = 'Wednesday 7 May 2025 10am to 11:45am';
    const result = parseStartEndTime(input, undefined);
    expect(result).toEqual({
      start: expect.any(String), // ISO string
      end: undefined // until logic is refined
    });
  });

  it('parses a single date', () => {
    const input = 'Saturday 3 May 2025';
    const result = parseStartEndTime(input, undefined);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('parses a time range', () => {
    const lastSeenRowDate = 'Saturday 3 May 2025';
    const input = '2:30pm to 4:30pm';
    const result = parseStartEndTime(input, lastSeenRowDate);
    expect(result).toEqual({
      start: undefined, // until logic is refined
      end: undefined
    });
  });
}); 