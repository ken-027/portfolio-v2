import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const Tooltip = () => {
  return (
    <>
      {/* Primary tooltip - for important actions and links */}
      <ReactTooltip
        id="portfolio-tooltip"
        place="top"
        effect="solid"
        className="bg-slate-800! text-white! rounded-lg! px-3! py-2! text-sm! shadow-xl! border! border-cyan-500/30! z-9999!"
        style={{
          backgroundColor: 'rgb(30 41 59)',
          color: 'rgb(241 245 249)',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          boxShadow: '0 10px 40px rgba(6, 182, 212, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.2)',
          fontWeight: '500',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
        }}
        arrowColor="rgb(30 41 59)"
        delayShow={300}
        delayHide={100}
      />
      
      {/* Quick tooltip - for interactive elements with shorter delay */}
      <ReactTooltip
        id="quick-tooltip"
        place="bottom"
        effect="solid"
        className="bg-slate-900! text-white! rounded-lg! px-2.5! py-1.5! text-xs! shadow-lg! border! border-slate-700! z-9999!"
        style={{
          backgroundColor: 'rgb(15 23 42)',
          color: 'rgb(203 213 225)',
          borderRadius: '0.5rem',
          padding: '0.375rem 0.625rem',
          fontSize: '0.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          fontWeight: '400',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
        }}
        arrowColor="rgb(15 23 42)"
        delayShow={500}
        delayHide={0}
      />

      {/* Info tooltip - for descriptive information */}
      <ReactTooltip
        id="info-tooltip"
        place="right"
        effect="solid"
        className="bg-blue-900/90! text-blue-100! rounded-lg! px-3! py-2! text-xs! shadow-xl! border! border-blue-500/40! z-9999! max-w-xs!"
        style={{
          backgroundColor: 'rgba(30, 58, 138, 0.95)',
          color: 'rgb(219 234 254)',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          fontSize: '0.75rem',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          fontWeight: '400',
          backdropFilter: 'blur(8px)',
          maxWidth: '20rem',
          zIndex: 9999,
        }}
        arrowColor="rgba(30, 58, 138, 0.95)"
        delayShow={600}
        delayHide={100}
      />
    </>
  );
};

export default Tooltip;
