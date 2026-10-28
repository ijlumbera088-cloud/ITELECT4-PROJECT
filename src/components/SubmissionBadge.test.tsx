import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SubmissionBadge } from './SubmissionBadge';

describe('SubmissionBadge', () => {
  it('shows the grade and details for a submitted item', () => {
    render(
      <SubmissionBadge
        course="ITELECT4"
        student="John Doe"
        grade={92}
        status="submitted"
      />,
    );

    expect(screen.getByText('ITELECT4')).toBeInTheDocument();
    expect(screen.getByText('Grade 92')).toBeInTheDocument();
    expect(screen.getByText('Submitted by John Doe')).toBeInTheDocument();
  });
});
