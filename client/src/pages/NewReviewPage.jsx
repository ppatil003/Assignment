import { useMemo, useState } from 'react';
import Stepper from '../components/Stepper';

const steps = [
  { label: 'Basic Info', subtitle: 'Employee and cycle details' },
  { label: 'Goals & Objectives', subtitle: 'Add review goals' },
  { label: 'Competencies', subtitle: 'Self and manager scores' },
  { label: 'Comments & Feedback', subtitle: 'Narrative feedback' },
  { label: 'Review & Submit', subtitle: 'Finalize and submit' },
];

const sampleCompetencies = ['Collaboration', 'Leadership', 'Execution', 'Communication'];

function NewReviewPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formState, setFormState] = useState({
    employee: 'Ananya Patel',
    reviewer: 'Rohit Sharma',
    department: 'Human Resources',
    cycle: 'Q1 2026',
    status: 'Draft',
    dueDate: '2026-04-15',
    progress: 35,
    trainingRating: 4.2,
    departmentKpiScore: 88,
    goals: [{ name: 'Improve retention', weight: 30, self: 4, manager: 4 }],
    competencies: sampleCompetencies.map((name) => ({ name, self: 3, manager: 3 })),
    selfComments: '',
    managerFeedback: '',
  });

  const overallCompetencyScore = useMemo(() => {
    const total = formState.competencies.reduce((sum, competency) => sum + competency.self + competency.manager, 0);
    return (total / (formState.competencies.length * 10)) * 5;
  }, [formState.competencies]);

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoalChange = (index, field, value) => {
    setFormState((prev) => {
      const nextGoals = [...prev.goals];
      nextGoals[index] = { ...nextGoals[index], [field]: value };
      return { ...prev, goals: nextGoals };
    });
  };

  const addGoal = () => {
    setFormState((prev) => ({
      ...prev,
      goals: [...prev.goals, { name: '', weight: 0, self: 0, manager: 0 }],
    }));
  };

  const removeGoal = (index) => {
    setFormState((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const handleCompetencyChange = (index, field, value) => {
    setFormState((prev) => {
      const nextCompetencies = [...prev.competencies];
      nextCompetencies[index] = { ...nextCompetencies[index], [field]: value };
      return { ...prev, competencies: nextCompetencies };
    });
  };

  const validateBasicInfo = () => {
    return [
      formState.employee,
      formState.reviewer,
      formState.department,
      formState.cycle,
      formState.dueDate,
    ].every(Boolean);
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateBasicInfo()) {
      window.alert('Please fill all required basic info fields before proceeding.');
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleSubmit = () => {
    if (activeStep < steps.length - 1) {
      handleNext();
    } else {
      window.alert('Review submitted successfully.');
    }
  };

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>New Review</h1>
          <p>Guide the appraisal process through a five-step review wizard.</p>
        </div>
      </div>

      <Stepper steps={steps} activeStep={activeStep} />

      <div className="wizard-panel">
        {activeStep === 0 && (
          <div className="wizard-step">
            <h2>Basic Info</h2>
            <div className="form-grid">
              <label>
                Employee <span className="required-indicator">*</span>
                <input
                  type="text"
                  value={formState.employee}
                  onChange={(e) => handleFieldChange('employee', e.target.value)}
                  required
                />
              </label>
              <label>
                Reviewer <span className="required-indicator">*</span>
                <input
                  type="text"
                  value={formState.reviewer}
                  onChange={(e) => handleFieldChange('reviewer', e.target.value)}
                  required
                />
              </label>
              <label>
                Department <span className="required-indicator">*</span>
                <input
                  type="text"
                  value={formState.department}
                  onChange={(e) => handleFieldChange('department', e.target.value)}
                  required
                />
              </label>
              <label>
                Cycle <span className="required-indicator">*</span>
                <input
                  type="text"
                  value={formState.cycle}
                  onChange={(e) => handleFieldChange('cycle', e.target.value)}
                  required
                />
              </label>
              <label>
                Status
                <select
                  value={formState.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                >
                  <option>Draft</option>
                  <option>Submitted</option>
                  <option>Under Review</option>
                  <option>Rework Requested</option>
                  <option>Approved</option>
                  <option>Completed</option>
                </select>
              </label>
              <label>
                Due Date
                <input
                  type="date"
                  value={formState.dueDate}
                  onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                />
              </label>
              <label>
                Progress
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formState.progress}
                  onChange={(e) => handleFieldChange('progress', Number(e.target.value))}
                />
              </label>
              <div className="form-grid-full review-summary-card">
                <div>
                  <span>Training Rating</span>
                  <strong>{formState.trainingRating}</strong>
                </div>
                <div>
                  <span>Department KPI Score</span>
                  <strong>{formState.departmentKpiScore}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="wizard-step">
            <h2>Goals & Objectives</h2>
            <div className="goals-table">
              <div className="goals-table__row goals-table__header">
                <span>Goal</span>
                <span>Weight %</span>
                <span>Self Rating</span>
                <span>Manager Rating</span>
                <span />
              </div>
              {formState.goals.map((goal, index) => (
                <div className="goals-table__row" key={index}>
                  <input
                    value={goal.name}
                    onChange={(e) => handleGoalChange(index, 'name', e.target.value)}
                    placeholder="Goal name"
                  />
                  <input
                    type="number"
                    value={goal.weight}
                    min="0"
                    max="100"
                    onChange={(e) => handleGoalChange(index, 'weight', Number(e.target.value))}
                  />
                  <input
                    type="number"
                    value={goal.self}
                    min="0"
                    max="5"
                    step="0.1"
                    onChange={(e) => handleGoalChange(index, 'self', Number(e.target.value))}
                  />
                  <input
                    type="number"
                    value={goal.manager}
                    min="0"
                    max="5"
                    step="0.1"
                    onChange={(e) => handleGoalChange(index, 'manager', Number(e.target.value))}
                  />
                  <button className="button button--secondary" onClick={() => removeGoal(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="button button--primary" onClick={addGoal} type="button">
              + Add Goal
            </button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="wizard-step">
            <h2>Competencies</h2>
            <div className="competency-grid">
              {formState.competencies.map((item, index) => (
                <div key={item.name} className="competency-card">
                  <h3>{item.name}</h3>
                  <label>
                    Self Rating
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={item.self}
                      onChange={(e) => handleCompetencyChange(index, 'self', Number(e.target.value))}
                    />
                    <span>{item.self}</span>
                  </label>
                  <label>
                    Manager Rating
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={item.manager}
                      onChange={(e) => handleCompetencyChange(index, 'manager', Number(e.target.value))}
                    />
                    <span>{item.manager}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="review-summary-card">
              <div>
                <span>Overall Competency Score</span>
                <strong>{overallCompetencyScore.toFixed(1)}</strong>
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="wizard-step">
            <h2>Comments & Feedback</h2>
            <div className="form-grid">
              <label className="form-grid-full">
                Self Comments
                <textarea
                  rows="5"
                  value={formState.selfComments}
                  onChange={(e) => handleFieldChange('selfComments', e.target.value)}
                />
              </label>
              <label className="form-grid-full">
                Manager Feedback
                <textarea
                  rows="5"
                  value={formState.managerFeedback}
                  onChange={(e) => handleFieldChange('managerFeedback', e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="wizard-step">
            <h2>Review & Submit</h2>
            <div className="summary-grid">
              <div>
                <strong>Employee</strong>
                <p>{formState.employee}</p>
              </div>
              <div>
                <strong>Reviewer</strong>
                <p>{formState.reviewer}</p>
              </div>
              <div>
                <strong>Department</strong>
                <p>{formState.department}</p>
              </div>
              <div>
                <strong>Cycle</strong>
                <p>{formState.cycle}</p>
              </div>
              <div>
                <strong>Status</strong>
                <p>{formState.status}</p>
              </div>
              <div>
                <strong>Due Date</strong>
                <p>{formState.dueDate}</p>
              </div>
            </div>
            <div className="review-summary-card review-summary-card--wide">
              <div>
                <span>Training Rating</span>
                <strong>{formState.trainingRating}</strong>
              </div>
              <div>
                <span>Department KPI Score</span>
                <strong>{formState.departmentKpiScore}</strong>
              </div>
              <div>
                <span>Overall Competency Score</span>
                <strong>{overallCompetencyScore.toFixed(1)}</strong>
              </div>
            </div>
            <div className="review-actions">
              <button className="button button--secondary" type="button">
                Save Draft
              </button>
              <button className="button button--primary" type="button">
                Submit Review
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="wizard-footer">
        <button
          className="button button--secondary"
          type="button"
          onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
          disabled={activeStep === 0}
        >
          Back
        </button>
        <button className="button button--primary" type="button" onClick={handleSubmit}>
          {activeStep === steps.length - 1 ? 'Submit Review' : 'Next'}
        </button>
      </div>
    </section>
  );
}

export default NewReviewPage;
