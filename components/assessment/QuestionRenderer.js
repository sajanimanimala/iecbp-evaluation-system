'use client';

import ShortTextQuestion from './questions/ShortTextQuestion';
import MCQQuestion from './questions/MCQQuestion';
import YesNoQuestion from './questions/YesNoQuestion';
import MultiSelectQuestion from './questions/MultiSelectQuestion';
import DragRankQuestion from './questions/DragRankQuestion';
import AudioQuestion from './questions/AudioQuestion';
import VideoQuestion from './questions/VideoQuestion';

export default function QuestionRenderer({ question, value, onChange, readOnly = false }) {
  switch (question.type) {
    case 'short_text':
      return <ShortTextQuestion question={question} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'mcq':
      return <MCQQuestion question={question} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'yes_no':
      return <YesNoQuestion question={question} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'multi_select':
      return <MultiSelectQuestion question={question} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'drag_rank':
      return <DragRankQuestion question={question} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'audio':
      return <AudioQuestion question={question} value={value} onChange={onChange} readOnly={readOnly} />;
    case 'video':
      return <VideoQuestion question={question} value={value} onChange={onChange} readOnly={readOnly} />;
    default:
      return (
        <div style={{ color: '#94A3B8', fontSize: '14px', padding: '1rem' }}>
          Unknown question type: {question.type}
        </div>
      );
  }
}