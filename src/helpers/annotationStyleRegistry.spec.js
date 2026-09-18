import createAnnotationStyleRegistry from './annotationStyleRegistry';

describe('annotationStyleRegistry', () => {
  const scopes = ['start', 'middle', 'end', 'fill'];

  it('registers and replaces entries by key within a scope', () => {
    const registry = createAnnotationStyleRegistry(scopes);
    const originalEntry = { key: 'custom', title: 'Original' };
    const replacementEntry = { key: 'custom', title: 'Replacement' };

    registry.register('fill', 'custom', originalEntry);
    registry.register('fill', 'custom', replacementEntry);

    expect(registry.get('fill', 'custom')).toBe(replacementEntry);
    expect(registry.has('middle', 'custom')).toBe(false);
  });

  it('unregisters an entry from one scope', () => {
    const registry = createAnnotationStyleRegistry(scopes);
    registry.register('fill', 'custom', { key: 'custom' });
    registry.register('end', 'custom', { key: 'custom' });

    registry.unregister('custom', 'fill');

    expect(registry.has('fill', 'custom')).toBe(false);
    expect(registry.has('end', 'custom')).toBe(true);
  });

  it('unregisters an entry from every scope when no scope is provided', () => {
    const registry = createAnnotationStyleRegistry(scopes);
    scopes.forEach((scope) => registry.register(scope, 'custom', { key: 'custom' }));

    registry.unregister('custom');

    scopes.forEach((scope) => expect(registry.has(scope, 'custom')).toBe(false));
  });

  it('ignores unknown scopes', () => {
    const registry = createAnnotationStyleRegistry(scopes);

    expect(registry.register('unknown', 'custom', { key: 'custom' })).toBe(false);
    expect(registry.unregister('custom', 'unknown')).toBe(false);
    expect(registry.get('unknown', 'custom')).toBeUndefined();
    expect(registry.has('unknown', 'custom')).toBe(false);
  });

  it('returns an entry only when it satisfies the applicability predicate', () => {
    const registry = createAnnotationStyleRegistry(['start']);
    const entry = { appliesTo: ['line'] };
    registry.register('start', 'custom', entry);

    expect(registry.getApplicable('start', 'custom', (value) => value.appliesTo.includes('line'))).toBe(entry);
    expect(registry.getApplicable('start', 'custom', (value) => value.appliesTo.includes('arrow'))).toBeUndefined();
  });
});
