'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ── SHARED SCENARIOS DATA (same source as scenarios/page.js) ──────────────────

const SCENARIOS = [
  {
    id: 1,
    title: 'Emergency Decision Overload in Healthcare Systems',
    category: 'Healthcare Operations',
    level: 'Advanced', levelColor: '#F97316',
    description: 'Many hospitals handle continuous patient inflow, emergency cases, limited ICU beds, staff shortages, and rapidly changing medical conditions simultaneously. Doctors and nurses must make life-critical decisions under time pressure while balancing patient priority, resource availability, and incomplete information. Over time, the accumulation of hidden operational stress and unpredictable emergencies makes effective decision-making increasingly difficult.',
    icon: '🏥',
    questions: [
      { number: 1, type: 'Short Text', question: 'During a sudden emergency surge, a hospital has only two ICU beds available while multiple critical patients continue arriving. What would be your immediate priority to manage the situation effectively?' },
      { number: 2, type: 'MCQ', question: 'During a continuous emergency rush, communication delays between departments begin affecting patient handling. Which approach would most effectively help stabilize hospital operations?', options: ['A. Prioritize faster patient movement between departments, even if communication accuracy slightly decreases', 'B. Temporarily centralize emergency decisions through a smaller coordination team to reduce confusion', 'C. Continue the existing workflow to avoid disrupting hospital operations further', 'D. Reduce attention toward non-critical communication until emergency pressure decreases'], correct: 'B' },
      { number: 3, type: 'Short Text', question: 'Even after increasing hospital staff and extending working hours, management notices that operational pressure and treatment delays continue increasing. What could be one hidden factor contributing to this situation?' },
      { number: 4, type: 'Drag & Drop Ranking', question: 'During a high-pressure emergency situation in a hospital, arrange the following actions in the order you would prioritize them to maintain operational stability.', options: ['Managing ICU bed allocation', 'Reducing patient waiting time', 'Coordinating communication between departments', 'Handling staff workload and exhaustion'] },
      { number: 5, type: 'Audio', question: 'After listening to the conversation, what do you think is the most critical issue affecting the hospital\'s ability to manage the situation effectively?' },
      { number: 6, type: 'Yes / No + Reasoning', question: 'In emergency healthcare situations, do you think hospitals should sometimes make faster temporary decisions even when complete patient information is unavailable?' },
      { number: 7, type: 'Short Text', question: 'Small operational delays inside hospitals may initially appear manageable during emergency situations. How can these small issues gradually develop into larger problems over time?' },
      { number: 8, type: 'Video', question: 'After observing the video, how can communication delays and coordination difficulties gradually affect the hospital\'s ability to manage emergency situations effectively over time?' },
      { number: 9, type: 'Multi-Select', question: 'Hospital management can immediately improve only TWO of the following areas due to limited resources. Select the two areas that would most effectively help stabilize hospital operations.', options: ['ICU capacity management', 'Communication between departments', 'Staff workload distribution', 'Patient waiting time reduction', 'Emergency patient transportation'] },
      { number: 10, type: 'Short Text', question: 'Operational pressure often continues increasing even when hospitals attempt to improve staffing, coordination, and resource management. Why do you think maintaining effective decision-making becomes increasingly difficult over time?' },
    ],
  },
  {
    id: 2,
    title: 'The Gap Between Social Media Popularity and Customer Loyalty',
    category: 'Marketing & Consumer Psychology',
    level: 'Intermediate', levelColor: '#3B82F6',
    description: 'A company invests heavily in influencer marketing, celebrity collaborations, and viral online campaigns to build a strong brand image among young customers. Despite massive online popularity and constant engagement, the company notices that customer trust remains weak, repeat purchases stay low, and long-term sales growth fails to improve.',
    icon: '📣',
    questions: [
      { number: 1, type: 'MCQ', question: 'The company\'s latest analytics report shows 4.2 million followers and a 9% engagement rate, yet only 6% of customers make a repeat purchase. Which option best explains the core issue?', options: ['A. The company needs more influencer collaborations to stay visible', 'B. High engagement is building attention but not trust or reason to return', 'C. A 6% repeat purchase rate is normal during rapid follower growth', 'D. The company should offer discounts to push repeat purchases'], correct: 'B' },
      { number: 2, type: 'Short Text', question: 'When a research team asks 100 followers "Would you recommend this brand to a close friend?" — 73 say no. What does this gap between recognition and recommendation tell you? Write in 3–4 lines.' },
      { number: 3, type: 'Yes / No + Reasoning', question: 'A follower has watched every campaign, shared every reel, and defended the brand for two years — but never made a purchase. Would you consider him/her a loyal customer?' },
      { number: 4, type: 'Multi-Select + Image', question: 'Look at the comments carefully. Select all the signs that suggest the company\'s popularity is not translating into real customer loyalty.', options: ['A. Customers are questioning the product\'s actual quality', 'B. People are engaging with the celebrity, not the brand', 'C. Shipping and support complaints are visible but ignored', 'D. Comments show curiosity but no evidence of repeat buyers', 'E. The brand is only responding to positive comments', 'F. Customers feel the product is overpriced for what it delivers'] },
      { number: 5, type: 'Short Text', question: 'A loyal customer sends a message: "I used to feel special buying from you. Now it feels like you only care about going viral." The company decides not to respond. What does this decision cost the company in the long run? Write in 3–4 lines.' },
      { number: 6, type: 'Short Text', question: 'CEO: "We have 5 million followers... But our sales growth is flat and customers aren\'t coming back." You are part of this discussion. How would you respond to this situation?' },
      { number: 7, type: 'MCQ', question: 'Most incoming complaints are from first-time buyers who feel the product didn\'t match the campaign they saw. What does this pattern most likely indicate?', options: ['A. The influencer campaigns are attracting the wrong audience', 'B. The company has built visibility without building trust or delivering on its promise', 'C. First-time buyers always need time to adjust their expectations', 'D. The company needs better influencer briefs to set realistic expectations'], correct: 'B' },
      { number: 8, type: 'Audio', question: 'You are responsible for responding to this customer. In 3–4 lines, write exactly what you would say — not a template, not a scripted apology.' },
      { number: 9, type: 'Drag & Drop Ranking', question: 'Rank the following actions from highest to lowest priority to effectively close the gap between online popularity and genuine customer loyalty.', options: ['Invest in post-purchase customer experience', 'Launch another celebrity collaboration', 'Understand why existing customers are not returning', 'Build a community around real customer stories', 'Increase social media posting frequency', 'Improve the product to match what campaigns promise', 'Partner with micro-influencers instead of celebrities'] },
      { number: 10, type: 'Short Text', question: 'A competing brand has half the followers and spends far less on marketing, yet their repeat purchase rate is four times higher. What does this competitor understand about customer loyalty that this company is missing? Write in 3–4 lines.' },
    ],
  },
  {
    id: 3,
    title: 'The Growing Impact of Uncontrolled Financial Decisions',
    category: 'Financial Decision-Making',
    level: 'Beginner', levelColor: '#4ADE80',
    description: 'A family carefully plans monthly expenses, savings, education costs, medical needs, and future financial goals. However, unexpected repairs, rising living costs, emergencies, social obligations, and lifestyle spending slowly disrupt the balance. Individually, each expense may seem manageable, but over time the combination creates financial pressure, reduced savings, and emotional stress.',
    icon: '💰',
    questions: [
      { number: 1, type: 'MCQ', question: 'The family had a stable financial plan, but over time unexpected repairs, medical bills, social obligations, and rising living costs slowly disrupted their savings. If you were part of this family, what would be your first instinct?', options: ['A. Sit down and trace back every expense to identify where the financial imbalance began', 'B. Immediately reduce lifestyle and discretionary spending to regain control', 'C. Talk openly with the family about the emotional and financial pressure before making major decisions', 'D. Accept that some situations are unavoidable and gradually adjust the financial plan moving forward'] },
      { number: 2, type: 'Yes / No + Reasoning', question: 'The family receives an invitation to a relative\'s wedding. Attending means spending money they had planned to save. The family decides to attend and adjusts their savings target for the month. Was this the right decision?' },
      { number: 3, type: 'Short Text', question: 'The cost of groceries, school fees, electricity, and basic necessities has quietly increased. Although the family has not changed its lifestyle, their savings continue shrinking month after month. What financial pattern is developing here, and why can it become dangerous over time? Write in 3–4 lines.' },
      { number: 4, type: 'Audio', question: 'Nobody in this family is irresponsible. Nobody is careless. But listen to what keeps happening. What behaviour is quietly making this family\'s financial situation worse — and why is it more dangerous than any single expense they made? Write in 3–4 lines.' },
      { number: 5, type: 'Multi-Select', question: 'This month the savings account hit zero for the first time. No single expense caused it — it was everything together. Your family needs to decide what to do next month. What would you do?', options: ['A. Sit down as a family and openly talk about where money is going', 'B. Quietly adjust the budget without worrying the rest of the family', 'C. Identify which expenses were needs and which were choices', 'D. Borrow money to cover this month and recover next month', 'E. Accept that some months will be like this and move forward', 'F. Find a way to increase income before cutting any expenses'] },
      { number: 6, type: 'Short Text', question: 'The family\'s income and lifestyle have not changed. But every month, a little more slips away. Six months from now, if nothing changes, what does this family\'s financial and emotional situation look like? Write in 3–4 lines.' },
      { number: 7, type: 'Video', question: 'This family planned everything — expenses, savings, education, medical needs. Yet here they are, late at night, surrounded by bills, unable to figure out where it went wrong. If you were sitting at that table with them right now, what is the first thing you would do — and why? Write in 3–4 lines.' },
      { number: 8, type: 'MCQ', question: 'This family did everything a financially responsible family should do — they planned, they budgeted, they prioritized. Yet they still ended up in financial stress. Which of the following best explains how this happens to even the most careful families?', options: ['A. Financial plans fail because people are never truly disciplined enough to follow them', 'B. Life does not happen in categories — real expenses cross boundaries and quietly break even the most careful plans', 'C. A family\'s emotional decisions will always override their financial ones eventually', 'D. No financial plan can survive without a significantly higher income as a safety net'], correct: 'B' },
      { number: 9, type: 'Drag & Drop Ranking', question: 'The family has finally decided to take control of their finances. Rank these from what you would do first to last — based on what will actually help this family recover and rebuild.', options: ['Have an honest family conversation about where money is going', 'Build a separate emergency fund immediately', 'Review every expense from the last 6 months', 'Set a strict budget for social obligations', 'Identify which expenses were needs versus emotional decisions', 'Find ways to increase monthly income', 'Pause all non-essential spending temporarily'] },
      { number: 10, type: 'Short Text', question: 'The family started the year with a solid plan. They ended it with financial stress, reduced savings, and emotional exhaustion — without ever making one obviously wrong decision. What is the one lesson this family learned the hardest way possible? Write in 3–4 lines.' },
    ],
  },
  {
    id: 4,
    title: 'Ride-Sharing Booking Synchronization Conflicts',
    category: 'System Design & User Experience',
    level: 'Advanced', levelColor: '#F97316',
    description: 'A woman tried booking an auto through two ride apps at the same time. Although only App A showed a confirmed booking on her phone, a driver from App B also called saying the ride was booked there. This created confusion because the customer could not see any booking details while the driver had received confirmation. In such cases, the fault lies mainly with the app\'s system rather than solely with the customer or driver.',
    icon: '🚗',
    questions: [
      { number: 1, type: 'Yes / No + Reasoning', question: 'Was the customer initially aware of both ride confirmations?' },
      { number: 2, type: 'MCQ', question: 'A ride-booking system triggers driver notifications and confirms rides before completing full transaction validation across all services. What could be a likely consequence of this system behavior?', options: ['A. Faster customer response time with improved accuracy', 'B. Duplicate or conflicting ride assignments due to premature confirmation', 'C. Reduced need for backend synchronization processes', 'D. Automatic elimination of booking errors through early alerts'], correct: 'B' },
      { number: 3, type: 'Drag & Drop Ranking', question: 'Which of the following correctly represents the order of events in the ride-sharing conflict scenario? Arrange in correct chronological order.', options: ['Customer notices mismatch in booking status', 'System processes requests from both apps simultaneously', 'Driver receives booking confirmation from App B', 'App A displays booking confirmation', 'Customer initiates ride booking on two apps'] },
      { number: 4, type: 'MCQ', question: 'What is the biggest operational risk if such synchronization failures happen repeatedly?', options: ['A. Drivers may stop using navigation', 'B. Platform trust and reliability collapse', 'C. Phone storage increases', 'D. Customer location accuracy improves'], correct: 'B' },
      { number: 5, type: 'Short Text', question: 'Why should customers not be completely blamed in this ride-booking conflict, and why did the situation become confusing for both the customer and driver? Write in 3–4 lines.' },
      { number: 6, type: 'Short Text', question: 'If you were both the customer and the system architect in this ride-booking conflict, what would be your main priorities? Address both roles in your response.' },
      { number: 7, type: 'Short Text', question: 'How do the booking confirmation responses differ between App A and App B? Write in 3–4 lines.' },
      { number: 8, type: 'Yes / No + Reasoning', question: 'Who faces more inconvenience in this ride-booking conflict — the driver or the customer? Take a position and explain your reasoning.' },
      { number: 9, type: 'Audio', question: 'What does this situation reveal about the ride-booking system? Write your analysis in 3–4 lines.' },
      { number: 10, type: 'Multi-Select + Image', question: 'What challenges might arise when App B is still processing while App A has already confirmed a ride? Select all that could realistically occur.', options: ['A. Confusion for both the customer and driver about which booking is valid', 'B. Delayed decision-making while waiting for App B to update', 'C. Uncertainty in ride availability causing duplicate booking attempts', 'D. Possible double charges billed to the customer', 'E. Driver receiving incorrect trip assignments from inconsistent data'] },
    ],
  },
  {
    id: 5,
    title: 'The Disconnect Between Customer Data Collection and Real Customer Satisfaction',
    category: 'Customer Experience & Product Analytics',
    level: 'Intermediate', levelColor: '#3B82F6',
    description: 'Companies collect huge amounts of customer feedback, analytics, and user behaviour data to improve their products, but many customers still feel that their actual needs and frustrations are not truly understood. Even with advanced tracking systems and insights, improving real customer satisfaction remains a major challenge.',
    icon: '📊',
    questions: [
      { number: 1, type: 'Yes / No + Reasoning', question: 'Do you think data-driven decision-making is enough to understand customers? Why or why not?' },
      { number: 2, type: 'MCQ', question: 'A product team improves features continuously, yet customer frustration keeps increasing silently. What hidden issue is most likely happening?', options: ['A. Companies are optimizing features instead of solving actual pain points', 'B. Customers dislike updates naturally', 'C. Servers are overloaded', 'D. Feedback systems are disabled'], correct: 'A' },
      { number: 3, type: 'Short Text', question: 'You are a CEO. Your team says "data shows everything is fine," but customers disagree. What is your decision and how would you approach closing the gap? Write in 3–4 lines.' },
      { number: 4, type: 'Short Text', question: 'A feature is heavily used according to data, but customers say it is confusing. How can this contradiction be explained? Write in 3–4 lines.' },
      { number: 5, type: 'Multi-Select', question: 'Which of the following could cause a gap between analytics and real customer satisfaction? Select all that apply.', options: ['A. Over-reliance on dashboards', 'B. Lack of user interviews', 'C. Real-time emotional tracking', 'D. Ignoring customer complaints'] },
      { number: 6, type: 'Short Text', question: 'What is the biggest lesson from this scenario about the relationship between customer data collection and real customer satisfaction? Write in 3–4 lines.' },
      { number: 7, type: 'MCQ', question: 'What hidden issue is most likely present in companies that collect large amounts of customer data but still fail to improve customer satisfaction?', options: ['A. Companies optimize metrics instead of actual experiences', 'B. Products lack internet access', 'C. Users stop using smartphones', 'D. Databases lose all records daily'], correct: 'A' },
      { number: 8, type: 'Short Text', question: 'Why do customers still feel misunderstood even after companies collect huge amounts of feedback and analytics data, and why can high engagement metrics still be misleading? Write in 3–4 lines.' },
      { number: 9, type: 'Audio', question: 'What disconnect is shown in this conversation between the customer and the support agent? Write your analysis in 3–4 lines.' },
      { number: 10, type: 'Video', question: 'Why do dashboards show positive results but customers feel unhappy? After watching the video, write your analysis in 3–4 lines.' },
    ],
  },
  {
    id: 6,
    title: 'The Unintended Consequences of Flexible Work-From-Home Policies',
    category: 'Workplace Collaboration & Productivity',
    level: 'Beginner', levelColor: '#4ADE80',
    description: 'A company introduced flexible work-from-home policies to improve employee happiness and work-life balance. At first, employees felt more comfortable and satisfied, but over time the company noticed a drop in productivity, delayed communication, and weaker team collaboration. Even though the solution solved one problem, it also created new challenges that the company had not fully expected.',
    icon: '🏠',
    questions: [
      { number: 1, type: 'Yes / No + Reasoning', question: 'Did WFH improve employee happiness initially? Answer Yes or No and explain.' },
      { number: 2, type: 'MCQ', question: 'Which factor most directly caused reduced collaboration in a work-from-home setup?', options: ['A. Office infrastructure', 'B. Lack of real-time interaction', 'C. Employee skills', 'D. Increased meetings'], correct: 'B' },
      { number: 3, type: 'MCQ', question: 'What is the correct sequence to fix communication delays in a WFH setup? a) Set response-time expectations  b) Implement structured communication channels  c) Organize daily/weekly sync meetings  d) Use real-time messaging tools', options: ['A. b → d → a → c', 'B. d → b → c → a', 'C. a → d → b → c', 'D. c → a → b → d'], correct: 'A' },
      { number: 4, type: 'Yes / No + Reasoning', question: 'Should companies prioritize employee happiness over productivity? Take a position and explain.' },
      { number: 5, type: 'Short Text', question: 'How can companies avoid failure when implementing work-from-home systems? Write in 3–4 lines.' },
      { number: 6, type: 'Short Text', question: 'If the company continues without making any changes to its work-from-home policy, what is the future risk for company performance? Write in 3–4 lines.' },
      { number: 7, type: 'Short Text', question: 'What would you do if employees are working independently but consistently missing deadlines under a work-from-home setup? Write in 3–4 lines.' },
      { number: 8, type: 'Audio', question: 'What problem does this situation show, whose responsibility is it mainly, and what would you do to fix it? Write in 3–4 lines.' },
      { number: 9, type: 'Video', question: 'What problems are shown in this video, and what would you do to fix them? Write in 3–4 lines.' },
      { number: 10, type: 'MCQ', question: 'Employees perform better with complete location flexibility. Select the option that best represents your position.', options: ['A. Strongly Agree — complete flexibility always improves performance', 'B. Agree — flexibility generally leads to better output', 'C. Neutral — it depends on job type and communication structure', 'D. Disagree — structure and presence matter more than flexibility'] },
    ],
  },
];

// ── TYPE → edit type mapping ──────────────────────────────────────────────────
// scenarios/page.js uses display labels like 'MCQ', 'Short Text', etc.
// The edit page uses internal keys like 'mcq', 'short_text', etc.
// This maps display label → internal key for the question type selector.


// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const QUESTION_TYPES = [
  { value: 'mcq',          label: 'MCQ',                  icon: '🔘', color: '#A78BFA' },
  { value: 'short_text',   label: 'Short Text',           icon: '✏️', color: '#60A5FA' },
  { value: 'yes_no',       label: 'Yes / No + Reasoning', icon: '❓', color: '#F472B6' },
  { value: 'audio',        label: 'Audio Response',       icon: '🎧', color: '#34D399' },
  { value: 'video',        label: 'Video Response',       icon: '🎬', color: '#FB923C' },
  { value: 'multi_select', label: 'Multi Select',         icon: '☑️', color: '#818CF8' },
  { value: 'drag_rank',    label: 'Drag & Drop Ranking',  icon: '↕️', color: '#F59E0B' },
  { value: 'multi_image',  label: 'Multi Select + Image', icon: '🖼️', color: '#38BDF8' },
];
const DISPLAY_TO_EDIT_TYPE = {
  "MCQ": "mcq",
  "Short Text": "short_text",
  "Yes / No + Reasoning": "yes_no",
  "Audio": "audio",
  "Video": "video",
  "Multi-Select": "multi_select",
  "Drag & Drop Ranking": "drag_rank",
  "Multi-Select + Image": "multi_image",
};

const CATEGORIES = [
  'Healthcare Operations',
  'Marketing & Consumer Psychology',
  'Financial Decision-Making',
  'System Design & User Experience',
  'Customer Experience & Product Analytics',
  'Workplace Collaboration & Productivity',
  'Other',
];

const TYPE_META = {
  mcq:          { color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
  short_text:   { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)'  },
  yes_no:       { color: '#F472B6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.3)' },
  audio:        { color: '#34D399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)'  },
  video:        { color: '#FB923C', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.3)'  },
  multi_select: { color: '#818CF8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.3)' },
  drag_rank:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
  multi_image:  { color: '#38BDF8', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.3)'  },
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const makeOption = (text = '') => ({ id: uid(), text, imageUrl: '' });
const makeQuestion = (number) => ({ id: uid(), number, type: 'short_text', text: '', options: [] });

// Convert a scenario question (display format) → edit format
function toEditQuestion(q) {
  const editType = DISPLAY_TO_EDIT_TYPE[q.type] || 'short_text';
  const opts = (q.options || []).map((o) =>
    typeof o === 'string'
      ? { id: uid(), text: o, imageUrl: '' }
      : { id: o.id || uid(), text: o.text || '', imageUrl: o.imageUrl || '' }
  );
  return {
    id: uid(),
    number: q.number,
    type: editType,
    text: q.question || q.text || '',
    options: opts,
  };
}

// ── SHARED UI ─────────────────────────────────────────────────────────────────

const inputBase = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(15,22,35,0.6)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px', padding: '11px 14px',
  color: '#F8FAFC', fontSize: '13px',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  outline: 'none', transition: 'border 0.2s ease, box-shadow 0.2s ease',
};

function InputField({ label, value, onChange, placeholder, multiline, rows = 3, required }) {
  const [focused, setFocused] = useState(false);
  const style = {
    ...inputBase,
    border: focused ? '1.5px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
    boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
    resize: multiline ? 'vertical' : 'none',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label.toUpperCase()}{required && <span style={{ color: '#F87171', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={style} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={style} />}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label.toUpperCase()}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputBase, border: focused ? '1.5px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)', boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px' }}>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt} style={{ background: '#1E2A40', color: '#F8FAFC' }}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function IconBtn({ onClick, color, children, title }) {
  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClick} title={title}
      style={{ width: '28px', height: '28px', borderRadius: '7px', background: `${color}12`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color, flexShrink: 0 }}>
      {children}
    </motion.button>
  );
}

function AddBtn({ onClick, color, label }) {
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', background: `${color}15`, border: `1px solid ${color}35`, color, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      {label}
    </motion.button>
  );
}

const DeleteX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function OptionList({ options, setOptions, keyColor, showImageUrl = false }) {
  const add = () => setOptions([...options, makeOption()]);
  const remove = (id) => setOptions(options.filter((o) => o.id !== id));
  const update = (id, field, val) => setOptions(options.map((o) => o.id === id ? { ...o, [field]: val } : o));
  return (
    <div>
      <AnimatePresence>
        {options.map((opt, i) => (
          <motion.div key={opt.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} style={{ marginBottom: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: `${keyColor}15`, border: `1px solid ${keyColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: keyColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{String.fromCharCode(65 + i)}</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <input type="text" value={opt.text} placeholder={`Option ${String.fromCharCode(65 + i)}`} onChange={(e) => update(opt.id, 'text', e.target.value)} style={{ ...inputBase, padding: '8px 12px' }} />
                {showImageUrl && <input type="text" value={opt.imageUrl} placeholder="Image URL — e.g. /images/scenario2-q4.png" onChange={(e) => update(opt.id, 'imageUrl', e.target.value)} style={{ ...inputBase, padding: '7px 12px', fontSize: '12px', color: '#94A3B8' }} />}
              </div>
              <IconBtn color="#F87171" onClick={() => remove(opt.id)} title="Remove option"><DeleteX /></IconBtn>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <AddBtn onClick={add} color={keyColor} label="Add Option" />
    </div>
  );
}

function RankList({ options, setOptions }) {
  const add = () => setOptions([...options, makeOption()]);
  const remove = (id) => setOptions(options.filter((o) => o.id !== id));
  const update = (id, val) => setOptions(options.map((o) => o.id === id ? { ...o, text: val } : o));
  return (
    <div>
      <AnimatePresence>
        {options.map((opt, i) => (
          <motion.div key={opt.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} style={{ marginBottom: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>#{i + 1}</span>
              </div>
              <input type="text" value={opt.text} placeholder={`Ranking item ${i + 1}`} onChange={(e) => update(opt.id, e.target.value)} style={{ ...inputBase, flex: 1, padding: '8px 12px' }} />
              <IconBtn color="#F87171" onClick={() => remove(opt.id)} title="Remove item"><DeleteX /></IconBtn>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <AddBtn onClick={add} color="#F59E0B" label="Add Ranking Item" />
    </div>
  );
}

function MediaField({ type }) {
  const [path, setPath] = useState('');
  const [focused, setFocused] = useState(false);
  const isAudio = type === 'audio';
  const color = isAudio ? '#34D399' : '#FB923C';
  const borderC = isAudio ? 'rgba(52,211,153,0.2)' : 'rgba(251,146,60,0.2)';
  const bgC = isAudio ? 'rgba(52,211,153,0.05)' : 'rgba(251,146,60,0.05)';
  return (
    <div style={{ padding: '14px', background: bgC, border: `1px dashed ${borderC}`, borderRadius: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '18px' }}>{isAudio ? '🎧' : '🎬'}</span>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{isAudio ? 'Audio File' : 'Video File'}</div>
          <div style={{ fontSize: '11px', color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{isAudio ? 'Place at: public/audios/' : 'Place at: public/videos/'}</div>
        </div>
      </div>
      <input type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder={isAudio ? '/audios/scenario1-q5.mp3' : '/videos/scenario1-q8.mp4'} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...inputBase, border: focused ? `1.5px solid ${color}80` : `1px solid ${borderC}`, boxShadow: focused ? `0 0 0 3px ${color}15` : 'none' }} />
    </div>
  );
}

function QuestionCard({ q, index, onUpdate, onRemove }) {
  const meta = TYPE_META[q.type] || TYPE_META.short_text;
  const typeLabel = QUESTION_TYPES.find((t) => t.value === q.type)?.label || q.type;
  const setOptions = (opts) => onUpdate({ ...q, options: opts });
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12, scale: 0.97 }} transition={{ duration: 0.3 }}
      style={{ background: 'linear-gradient(145deg, #1E2A40, #24324A)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(99,102,241,0.35)', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>Q{index + 1}</span>
          </div>
          <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{typeLabel.toUpperCase()}</span>
        </div>
        <IconBtn color="#F87171" onClick={onRemove} title="Remove question">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </IconBtn>
      </div>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <InputField label="Question Text" required value={q.text} onChange={(val) => onUpdate({ ...q, text: val })} placeholder="Enter the question…" multiline rows={3} />
        <SelectField label="Question Type" value={q.type} onChange={(val) => onUpdate({ ...q, type: val, options: [] })} options={QUESTION_TYPES.map((t) => ({ value: t.value, label: `${t.icon}  ${t.label}` }))} />
        <AnimatePresence mode="wait">
          <motion.div key={q.type} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {q.type === 'mcq' && (<div><div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>OPTIONS</div><OptionList options={q.options} setOptions={setOptions} keyColor="#A78BFA" /></div>)}
            {q.type === 'multi_select' && (<div><div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SELECTABLE OPTIONS</div><OptionList options={q.options} setOptions={setOptions} keyColor="#818CF8" /></div>)}
            {q.type === 'multi_image' && (<div><div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>OPTIONS WITH IMAGE</div><OptionList options={q.options} setOptions={setOptions} keyColor="#38BDF8" showImageUrl /></div>)}
            {q.type === 'drag_rank' && (<div><div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RANKING ITEMS</div><RankList options={q.options} setOptions={setOptions} /></div>)}
            {q.type === 'audio' && <MediaField type="audio" />}
            {q.type === 'video' && <MediaField type="video" />}
            {q.type === 'yes_no' && (<div style={{ padding: '10px 14px', background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.15)', borderRadius: '10px' }}><span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Shows a <span style={{ color: '#F472B6', fontWeight: 600 }}>Yes / No</span> choice + reasoning textarea. No options needed.</span></div>)}
            {q.type === 'short_text' && (<div style={{ padding: '10px 14px', background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: '10px' }}><span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Shows an open-ended <span style={{ color: '#60A5FA', fontWeight: 600 }}>textarea</span>. No options needed.</span></div>)}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function EditScenarioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ?? '1';



  const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [category, setCategory] = useState('');
const [customCategory, setCustomCategory] = useState("");
const [level, setLevel] = useState('');
const [icon, setIcon] = useState("🧩");
const [questions, setQuestions] = useState([]);
useEffect(() => {
  const fetchScenario = async () => {
    try {
      const response = await fetch(
        `/api/admin/scenarios/${id}`
      );

      const data = await response.json();

      console.log(data);

      setName(data.title || "");
      setDescription(data.description || "");
      if (CATEGORIES.includes(data.category)) {
  setCategory(data.category);
} else {
  setCategory("Other");
  setCustomCategory(data.category || "");
}
      setLevel(data.level || "");
      setIcon(data.icon || "🧩");

      setQuestions(
        (data.questions || []).map((q) => ({
          id: q.id,
          number: q.orderNo,
          type: q.questionType,
          text: q.questionText,
          options: (q.options || []).map((o) => ({
            id: o.id,
            text: o.optionText || "",
            imageUrl: o.imageUrl || "",
          })),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (id) {
    fetchScenario();
  }
}, [id]);
  const [saved, setSaved] = useState(false);

  const addQuestion = () => setQuestions((prev) => [...prev, makeQuestion(prev.length + 1)]);

  const removeQuestion = (qid) => setQuestions((prev) =>
    prev.filter((q) => q.id !== qid).map((q, i) => ({ ...q, number: i + 1 }))
  );

  const updateQuestion = (qid, updated) => setQuestions((prev) => prev.map((q) => q.id === qid ? updated : q));

  const handleUpdate = async () => {
  try {
    const response = await fetch(
      `/api/admin/scenarios/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  name,
  description,
category: category === "Other"
  ? customCategory
  : category,  level,
  questions,
  icon,
}),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update");
    }

    setSaved(true);

setTimeout(() => {
  router.push("/dashboard/admin/scenarios");
}, 1500);
  } catch (error) {
    console.error(error);
    alert("Failed to update scenario");
  }
};

  return (
    <div style={{ maxWidth: '860px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '0.75rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
          <span style={{ fontSize: '11px', color: '#818CF8', fontWeight: 600, letterSpacing: '0.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SCENARIO MANAGEMENT</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.85rem', fontWeight: 700, color: '#F8FAFC', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Edit Scenario</h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Editing: <span style={{ color: '#94A3B8', fontWeight: 500 }}>{name}</span>
            </p>
          </div>
          <div style={{ marginLeft: 'auto', padding: '5px 14px', borderRadius: '999px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '11px', color: '#F59E0B', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>✏️ EDIT MODE</div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        style={{ background: 'linear-gradient(145deg, #1E2A40, #24324A)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>Scenario Information</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <InputField label="Scenario Name" required value={name} onChange={setName} placeholder="e.g. Emergency Decision Overload in Healthcare Systems" />
          <InputField label="Scenario Description" required value={description} onChange={setDescription} placeholder="Describe what this scenario is about…" multiline rows={4} />
          <SelectField label="Scenario Category" value={category} onChange={setCategory} options={CATEGORIES} />
          {category === "Other" && (
  <InputField
    label="Custom Category"
    value={customCategory}
    onChange={setCustomCategory}
    placeholder="Enter custom category"
  />
)}<SelectField
  label="Scenario Level"
  value={level}
  onChange={setLevel}
  options={[
    "Beginner",
    "Intermediate",
    "Advanced",
  ]}
/>
<InputField
  label="Scenario Icon (Emoji)"
  value={icon}
  onChange={setIcon}
  placeholder="🏥"
/>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>Question Builder</h2>
            <span style={{ padding: '2px 10px', borderRadius: '999px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', fontSize: '11px', color: '#818CF8', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
          <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(99,102,241,0.3)' }} whileTap={{ scale: 0.97 }} onClick={addQuestion}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', background: 'linear-gradient(135deg, #6366F1, #7C3AED)', border: 'none', borderRadius: '11px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 700, color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,0.25)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Question
          </motion.button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <AnimatePresence mode="popLayout">
            {questions.map((q, i) => (
              <QuestionCard key={q.id} q={q} index={i} onUpdate={(updated) => updateQuestion(q.id, updated)} onRemove={() => removeQuestion(q.id)} />
            ))}
          </AnimatePresence>
          <motion.div whileHover={{ borderColor: 'rgba(99,102,241,0.4)' }} onClick={addQuestion}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px', cursor: 'pointer', transition: 'border 0.2s ease' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <span style={{ fontSize: '13px', color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add another question</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', flexWrap: 'wrap' }}>
        <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.97 }} onClick={handleUpdate}
          style={{ flex: 1, minWidth: '180px', padding: '14px', background: 'linear-gradient(135deg, #6366F1, #7C3AED)', border: 'none', borderRadius: '14px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 24px rgba(99,102,241,0.3)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Update Scenario
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => router.back()}
          style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Cancel
        </motion.button>
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
              <span style={{ fontSize: '13px', color: '#4ADE80', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Scenario updated — check console</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}