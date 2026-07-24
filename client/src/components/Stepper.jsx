function Stepper({ steps, activeStep }) {
  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div key={step.label} className={`stepper__item${index === activeStep ? ' stepper__item--active' : ''}`}>
          <div className="stepper__circle">{index + 1}</div>
          <div>
            <div className="stepper__label">{step.label}</div>
            <div className="stepper__subtitle">{step.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Stepper;
