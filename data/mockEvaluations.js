export const mockSubmissions = [
    {
        id: 's1',
        candidateName: 'Aisha Khan',
        email: 'aisha.khan@example.com',
        scenario: 'scenario1',
        date: new Date().toISOString(),
        aiScore: 82,
        status: 'pending',
        ai: { understanding: 80, awareness: 78, decision: 85, clarity: 85, overall: 82 },
        evidence: [
            { signal: 'Understanding', text: 'Candidate identified root cause and corrective actions.' },
            { signal: 'Decision', text: 'Clear steps proposed with prioritization.' }
        ],
        questions: [
            { id: 'q1', question: 'What is the root cause?', answer: 'Lack of input validation', timeTaken: 42, valid: true },
            { id: 'q2', question: 'How to fix?', answer: 'Add validation and sanitization', timeTaken: 55, valid: true }
        ]
    },
    {
        id: 's2',
        candidateName: 'Diego Ramirez',
        email: 'diego.r@example.com',
        scenario: 'scenario3',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        aiScore: 64,
        status: 'modified',
        ai: { understanding: 60, awareness: 62, decision: 68, clarity: 66, overall: 64 },
        evidence: [{ signal: 'Awareness', text: 'Recognized constraints but missed edge cases.' }],
        questions: [{ id: 'q1', question: 'Identify constraints', answer: 'Budget and timeline limits', timeTaken: 75, valid: true }]
    },
    {
        id: 's3',
        candidateName: 'Priya Patel',
        email: 'priya.p@example.com',
        scenario: 'scenario2',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        aiScore: 91,
        status: 'approved',
        ai: { understanding: 92, awareness: 89, decision: 90, clarity: 93, overall: 91 },
        evidence: [{ signal: 'Clarity', text: 'Responses were concise and actionable.' }],
        questions: [{ id: 'q1', question: 'Outline solution', answer: 'Stepwise mitigation plan', timeTaken: 48, valid: true }]
    }
];
