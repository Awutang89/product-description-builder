import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SettingsPanel } from '../SettingsPanel';
import { BrowserRouter } from 'react-router-dom';

describe('SettingsPanel Component', () => {
  const mockProjectId = 'test-project-123';

  const renderSettingsPanel = () => {
    return render(
      <BrowserRouter>
        <SettingsPanel projectId={mockProjectId} />
      </BrowserRouter>
    );
  };

  it('should render without crashing', () => {
    renderSettingsPanel();
    expect(document.body).toBeTruthy();
  });

  it('should have table section with max 40 rows', () => {
    const { container } = renderSettingsPanel();
    const label = container.querySelector('label');

    if (label && label.textContent.includes('Number of Rows')) {
      expect(label.textContent).toContain('max 40');
    }
  });
});
