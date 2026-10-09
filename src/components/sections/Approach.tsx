'use client';

import { useState, type KeyboardEvent } from 'react';
import { SectionHead } from '@/components/shared/SectionHead';
import { approachSteps } from '@/content/approach';

const LAST = approachSteps.length - 1;

export function Approach() {
  const [active, setActive] = useState(0);
  const current = approachSteps[active]!;

  const move = (next: number) => {
    const wrapped = (next + approachSteps.length) % approachSteps.length;
    setActive(wrapped);
    document
      .getElementById(`phase-${approachSteps[wrapped]?.number}`)
      ?.focus();
  };

  const onNodeKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      move(i + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      move(i - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      move(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      move(LAST);
    }
  };

  return (
    <section id="approach">
      <div className="wrap">
        <SectionHead
          kicker="Our Approach"
          title="From opportunity to operation."
          description="Our expertise spans the full lifecycle of a project, transaction, joint venture or company — from concept through to maturity."
        />
        <div className="exec-sys">
          <div
            className="exec-map"
            role="tablist"
            aria-label="BGC execution lifecycle — nine phases"
          >
            {approachSteps.map((step, i) => (
              <div className="step reveal" role="presentation" key={step.number}>
                <button
                  type="button"
                  role="tab"
                  id={`phase-${step.number}`}
                  className="exec-node"
                  aria-selected={i === active}
                  aria-controls="phase-panel"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onNodeKeyDown(e, i)}
                >
                  <span className="exec-node-marker" aria-hidden="true">
                    <span className="exec-dot" />
                    <span className="n">{step.number}</span>
                  </span>
                  <span className="exec-node-title">{step.title}</span>
                  <span className="sr-only">{step.description}</span>
                </button>
              </div>
            ))}
          </div>
          <div
            className="exec-panel"
            role="tabpanel"
            id="phase-panel"
            tabIndex={0}
            aria-labelledby={`phase-${current.number}`}
          >
            <div className="exec-panel-top">
              <span className="exec-panel-idx" aria-hidden="true">
                {current.number}
              </span>
              <span className="exec-panel-count">
                Phase {current.number} / 09
              </span>
            </div>
            <h3>{current.title}</h3>
            <p>{current.description}</p>
            <div className="exec-progress" aria-hidden="true">
              {approachSteps.map((s, i) => (
                <i key={s.number} className={i === active ? 'on' : ''} />
              ))}
            </div>
            <div className="exec-panel-nav">
              <button
                type="button"
                onClick={() => setActive((active + LAST) % (LAST + 1))}
              >
                ← Previous phase
              </button>
              <button
                type="button"
                onClick={() => setActive((active + 1) % (LAST + 1))}
              >
                Next phase →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
