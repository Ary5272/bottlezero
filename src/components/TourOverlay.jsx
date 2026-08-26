import { useTour } from '../state/TourContext'
import Icon from './Icon'

export default function TourOverlay() {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour } = useTour()

  if (!isActive || !steps[currentStep]) return null

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[999]" onClick={skipTour} />
      <div className="fixed bottom-6 left-6 right-6 max-w-sm mx-auto z-[1000] bg-surface rounded-2xl border border-line shadow-lg p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-ink">{step.title}</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">{step.desc}</p>
          </div>
          <button
            onClick={skipTour}
            className="shrink-0 text-faint hover:text-ink p-1 cursor-pointer"
          >
            <Icon name="plus" size={16} className="rotate-45" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-faint">
            Step {currentStep + 1} of {steps.length}
          </span>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-3 py-1.5 text-xs rounded-lg border border-line text-muted hover:text-ink cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={nextStep}
              className="px-3 py-1.5 text-xs rounded-lg bg-accent text-white font-medium hover:bg-accent-dark cursor-pointer"
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>

        <button
          onClick={skipTour}
          className="text-xs text-faint hover:text-muted cursor-pointer text-center"
        >
          Skip tour
        </button>
      </div>
    </>
  )
}
