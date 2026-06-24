'use client';

import ShortTextQuestion from './questions/ShortTextQuestion';
import MCQQuestion from './questions/MCQQuestion';
import YesNoQuestion from './questions/YesNoQuestion';
import MultiSelectQuestion from './questions/MultiSelectQuestion';
import DragRankQuestion from './questions/DragRankQuestion';
import AudioQuestion from './questions/AudioQuestion';
import VideoQuestion from './questions/VideoQuestion';

export default function QuestionRenderer({ question, value, onChange, readOnly = false }) {
  const normalizedQuestion = question || {};
  const normalizedType = normalizedQuestion.type || 'short_text';

  switch (normalizedType) {
    case 'short_text':
      return <ShortTextQuestion question={normalizedQuestion} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'mcq':
      return <MCQQuestion question={normalizedQuestion} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'yes_no':
      return <YesNoQuestion question={normalizedQuestion} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'multi_select':
      return <MultiSelectQuestion question={normalizedQuestion} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'drag_rank':
      return <DragRankQuestion question={normalizedQuestion} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'audio':
      return <AudioQuestion question={normalizedQuestion} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'video':
      return <VideoQuestion question={normalizedQuestion} value={value} onChange={onChange} readOnly={readOnly} />;
    default:
      return (
        <div style={{ color: '#94A3B8', fontSize: '14px', padding: '1rem' }}>
          Unknown question type: {normalizedType}
        </div>
      );
  }
}