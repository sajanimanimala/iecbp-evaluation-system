// Single source of truth for AI trait taxonomy.
// This list is frozen to prevent any traits from being generated outside the allowed set.

export const AI_TRAIT_TAXONOMY = Object.freeze([
    'Execution Focused',
    'Decision Oriented',
    'Risk Aware',
    'Stakeholder Aware',
    'Analytical Thinker',
    'Strategic Thinker',
    'Problem Solver',
    'Planner',
    'Communicator',
    'Collaborative Thinker',
]);

export const AI_TRAIT_TAXONOMY_SET = new Set(AI_TRAIT_TAXONOMY);

export function isValidAiTrait(trait) {
    return AI_TRAIT_TAXONOMY_SET.has(trait);
}
