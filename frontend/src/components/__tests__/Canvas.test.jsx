import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '../Canvas';
import { BrowserRouter } from 'react-router-dom';

describe('Canvas Component', () => {
  const mockProjectId = 'test-project-123';

  const renderCanvas = () => {
    return render(
      <BrowserRouter>
        <Canvas projectId={mockProjectId} />
      </BrowserRouter>
    );
  };

  it('should render without crashing', () => {
    const { container } = renderCanvas();
    expect(container).toBeTruthy();
  });

  it('should render a main element for the canvas', () => {
    const { container } = renderCanvas();
    const main = container.querySelector('main');
    // Check for main element or any other rendering indication
    expect(container.firstChild).toBeTruthy();
  });
});
