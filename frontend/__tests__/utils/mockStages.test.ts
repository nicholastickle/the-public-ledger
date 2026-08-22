import { describe, it, expect } from 'vitest';
import { mockRegulationStageHistory, mockRegulationPassage } from '@/app/lib/mockStages';
import type { ParliamentRegulation } from '@/app/types/parliament';

const regAt = (overrides: Partial<ParliamentRegulation> & { id: string }): ParliamentRegulation => ({
  title: 'The Test Regulations 2026',
  enabling_act: 'Test Act 2026',
  procedure: 'negative',
  laid_date: '2026-06-01',
  made_date: null,
  deadline: '2026-08-10',
  status: 'pending',
  house: 'Both',
  last_update: '2026-06-01T09:00:00Z',
  detail_url: null,
  paper_number: null,
  ...overrides,
});

describe('mockRegulationStageHistory', () => {
  it('is most-recent first', () => {
    const history = mockRegulationStageHistory(regAt({ id: '1', status: 'made', made_date: '2026-05-01' }));
    const dates = history.map(s => s.date);
    const sorted = [...dates].sort();
    expect(dates).toEqual([...sorted].reverse());
  });

  it('a made negative instrument that was never prayed against carries no vote at all in its history', () => {
    // id chosen (by trial against mockPrayerTabled) to land in the untabled majority.
    const reg = regAt({ id: '1', status: 'made', made_date: '2026-05-01' });
    const history = mockRegulationStageHistory(reg);
    const divisions = history.map(s => s.division).filter(Boolean);
    // Either no division step exists, or the one that does is "silent".
    for (const d of divisions) expect(d!.status).toBe('silent');
  });

  it('an annulled instrument always carries a voted division in its history', () => {
    const reg = regAt({ id: '4', status: 'annulled' });
    const history = mockRegulationStageHistory(reg);
    const votedSteps = history.filter(s => s.division?.status === 'voted');
    expect(votedSteps.length).toBeGreaterThan(0);
    for (const s of votedSteps) expect(s.division!.against!).toBeGreaterThan(s.division!.for!);
  });

  it('an affirmative instrument records a "Motion to approve" step for each House once settled', () => {
    const reg = regAt({ id: '2', procedure: 'affirmative', status: 'made', made_date: '2026-06-01' });
    const history = mockRegulationStageHistory(reg);
    const motions = history.filter(s => s.stepName === 'Motion to approve the instrument');
    expect(motions).toHaveLength(2); // Commons + Lords
    expect(motions.map(s => s.house).sort()).toEqual(['Commons', 'Lords']);
  });

  it('a still-pending affirmative instrument has not reached its approval motion yet', () => {
    const reg = regAt({ id: '1', procedure: 'affirmative', status: 'pending' });
    const history = mockRegulationStageHistory(reg);
    expect(history.every(s => !s.stepName.startsWith('Motion to approve'))).toBe(true);
    expect(history.length).toBeGreaterThan(0); // it has at least been laid
  });

  it('is deterministic for the same regulation', () => {
    const reg = regAt({ id: '9', status: 'made', made_date: '2026-05-01' });
    expect(mockRegulationStageHistory(reg)).toEqual(mockRegulationStageHistory(reg));
  });
});

describe('mockRegulationPassage', () => {
  it('renders one panel per House laid before, plus an outcome panel', () => {
    const both = mockRegulationPassage(regAt({ id: '1', house: 'Both' }));
    expect(both).toHaveLength(3);

    const commonsOnly = mockRegulationPassage(regAt({ id: '1', house: 'Commons' }));
    expect(commonsOnly).toHaveLength(2);
  });

  it("marks a negative instrument's prayer step not-applicable when it was never tabled", () => {
    // id '1' never draws a prayer at any status (see mockPrayerTabled tests).
    const panels = mockRegulationPassage(regAt({ id: '1', house: 'Commons', status: 'made', made_date: '2026-05-01' }));
    const housePanel = panels[0];
    const prayerStage = housePanel.stages.find(s => s.label.includes('Prayer'));
    expect(prayerStage?.state).toBe('not-applicable');
  });

  it('never marks the objection period "done" for a withdrawn instrument — it never ran to completion', () => {
    const panels = mockRegulationPassage(regAt({ id: '1', status: 'withdrawn' }));
    const outcome = panels[panels.length - 1];
    const objectionStage = outcome.stages.find(s => s.label === 'Objection period ends');
    expect(objectionStage?.state).toBe('not-applicable');
    expect(outcome.stages.find(s => s.label === 'Withdrawn')?.state).toBe('done');
  });

  it('marks an affirmative instrument\'s approval motion "upcoming" while still pending', () => {
    const panels = mockRegulationPassage(regAt({ id: '2', procedure: 'affirmative', house: 'Commons', status: 'pending' }));
    const stage = panels[0].stages.find(s => s.label === 'Motion to approve');
    expect(stage?.state).toBe('upcoming');
  });
});
